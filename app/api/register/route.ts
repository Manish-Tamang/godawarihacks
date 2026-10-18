import {randomUUID} from "node:crypto";
import {NextRequest, NextResponse} from "next/server";
import {getWriteClient} from "@/sanity/lib/writeClient";
import {CURRENT_SEASON} from "@/sanity/lib/seasons";
import {sendEmail} from "@/app/lib/mail";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_DOCUMENT_TYPES = [...ALLOWED_IMAGE_TYPES, "application/pdf"];
const VALID_DOCUMENT_TYPES = ["id", "citizenship", "birthcertificate"];

interface PendingMember {
  fullName: string;
  email: string;
  phone: string;
  documentType: string;
  document: File;
}

async function verifyTurnstile(token: string | null, ip: string | null) {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({secret, response: token});
  if (ip) body.set("remoteip", ip);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {method: "POST", body},
  );
  const result = (await res.json()) as {success?: boolean};
  return result.success === true;
}

async function uploadAsset(
  kind: "image" | "file",
  file: File,
  filename: string,
) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return getWriteClient().assets.upload(kind, buffer, {
    filename,
    contentType: file.type,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const turnstileOk = await verifyTurnstile(
      formData.get("turnstileToken") as string | null,
      request.headers.get("cf-connecting-ip"),
    );
    if (!turnstileOk) {
      return NextResponse.json(
        {error: "Verification failed. Please try again."},
        {status: 400},
      );
    }

    const teamName = (formData.get("teamName") as string)?.trim();
    if (!teamName) {
      return NextResponse.json(
        {error: "Team name is required"},
        {status: 400},
      );
    }

    const memberCount = parseInt(formData.get("memberCount") as string) || 3;
    if (memberCount < 1 || memberCount > 4) {
      return NextResponse.json(
        {error: "Team must have between 1 and 4 members"},
        {status: 400},
      );
    }

    const paymentScreenshot = formData.get("paymentScreenshot") as File | null;
    if (!paymentScreenshot) {
      return NextResponse.json(
        {error: "Payment screenshot is required"},
        {status: 400},
      );
    }
    if (paymentScreenshot.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        {error: "Payment screenshot exceeds 5MB limit"},
        {status: 400},
      );
    }
    if (!ALLOWED_IMAGE_TYPES.includes(paymentScreenshot.type)) {
      return NextResponse.json(
        {error: "Invalid payment screenshot type. Only JPG, PNG allowed."},
        {status: 400},
      );
    }

    const members: PendingMember[] = [];
    for (let i = 1; i <= memberCount; i++) {
      const fullName = (formData.get(`member${i}_name`) as string)?.trim();
      const email = (formData.get(`member${i}_email`) as string)
        ?.toLowerCase()
        .trim();
      const phone = (formData.get(`member${i}_phone`) as string)?.trim();
      const documentType = formData.get(`member${i}_documentType`) as string;
      const document = formData.get(`member${i}_document`) as File | null;

      if (!fullName || !email || !phone || !documentType || !document) {
        return NextResponse.json(
          {error: `All fields are required for member ${i}`},
          {status: 400},
        );
      }
      if (!VALID_DOCUMENT_TYPES.includes(documentType)) {
        return NextResponse.json(
          {error: `Invalid document type for member ${i}`},
          {status: 400},
        );
      }
      if (document.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          {error: `Document for member ${i} exceeds 5MB limit`},
          {status: 400},
        );
      }
      if (!ALLOWED_DOCUMENT_TYPES.includes(document.type)) {
        return NextResponse.json(
          {
            error: `Invalid file type for member ${i}. Only PDF, JPG, PNG allowed.`,
          },
          {status: 400},
        );
      }

      members.push({fullName, email, phone, documentType, document});
    }

    // Upload every asset before creating the document, so a failed upload
    // cannot leave a half-populated registration in the dataset.
    const paymentAsset = await uploadAsset(
      "image",
      paymentScreenshot,
      `payment-${Date.now()}-${paymentScreenshot.name}`,
    );

    const memberAssets = await Promise.all(
      members.map((member, index) =>
        uploadAsset(
          "file",
          member.document,
          `member${index + 1}-${Date.now()}-${member.document.name}`,
        ),
      ),
    );

    const registration = await getWriteClient().create({
      _type: "teamRegistration",
      teamName,
      season: CURRENT_SEASON,
      status: "pending",
      registeredAt: new Date().toISOString(),
      paymentVerified: false,
      paymentScreenshot: {
        _type: "image",
        asset: {_type: "reference", _ref: paymentAsset._id},
      },
      members: members.map((member, index) => ({
        _key: randomUUID(),
        _type: "registrationMember",
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        documentType: member.documentType,
        document: {
          _type: "file",
          asset: {_type: "reference", _ref: memberAssets[index]._id},
        },
      })),
    });

    const emailPromises = members.map((member) =>
      sendEmail({
        to: member.email,
        subject: `Registration Received - Godawari Hacks`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #084750; text-align: center;">Registration Received!</h1>
            <p>Hello ${member.fullName},</p>
            <p>Thank you for registering your team <strong>${teamName}</strong> for Godawari Hacks!</p>
            <p>We have received your registration details and payment screenshot. Our team will review your submission and update your status within 24-48 hours.</p>
            <div style="background: #fdfaf0; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;"><strong>Status:</strong> Your registration is currently <strong>Pending Review</strong>.</p>
            </div>
            <p>Once approved, you will receive another email with further instructions and an invitation to our official Discord server.</p>
            <p>Best regards,<br>The Godawari Hacks Team</p>
          </div>
        `,
      }),
    );

    Promise.all(emailPromises).catch((err) =>
      console.error("Error sending registration confirmation emails:", err),
    );

    return NextResponse.json(
      {
        success: true,
        message: "Team registration successful",
        team: {
          id: registration._id,
          team_name: registration.teamName,
          status: registration.status,
          registration_date: registration.registeredAt,
        },
        members: members.map((member) => ({
          name: member.fullName,
          email: member.email,
          phone: member.phone,
        })),
      },
      {status: 201},
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {error: "Internal server error"},
      {status: 500},
    );
  }
}
