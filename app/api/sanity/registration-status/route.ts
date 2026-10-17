import {NextRequest, NextResponse} from "next/server";
import {isValidSignature, SIGNATURE_HEADER_NAME} from "@sanity/webhook";
import {sendEmail} from "@/app/lib/mail";

interface StatusChangePayload {
  teamName?: string;
  status?: string;
  members?: Array<{fullName?: string; email?: string}>;
}

function buildEmail(
  memberName: string,
  teamName: string,
  status: string,
): {subject: string; html: string} {
  if (status === "approved") {
    return {
      subject:
        "Congratulations! Your registration for Godawari Hacks is APPROVED! 🎉",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #084750; border-radius: 10px;">
          <h1 style="color: #084750; text-align: center;">Registration Approved!</h1>
          <p>Hello ${memberName},</p>
          <p>We are excited to inform you that your team <strong>${teamName}</strong> has been <strong>approved</strong> for Godawari Hacks!</p>
          <p>Get ready for an amazing hackathon experience. We will share further details regarding the event schedule and venue protocols soon.</p>
          <div style="background: #f0fdf4; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <p style="margin: 0; color: #166534;"><strong>What's next?</strong> Keep an eye on your email for the participant guide and official Discord server invitation.</p>
          </div>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br>The Godawari Hacks Team</p>
        </div>
      `,
    };
  }

  if (status === "rejected") {
    return {
      subject: "Update regarding your Godawari Hacks Registration",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #084750;">Registration Update</h2>
          <p>Hello ${memberName},</p>
          <p>Thank you for your interest in Godawari Hacks. We regret to inform you that your team <strong>${teamName}</strong> registration has <strong>not been approved</strong> at this time.</p>
          <p>This could be due to incomplete documentation or payment verification issues. If you believe this is a mistake, please contact us immediately.</p>
          <p>Best regards,<br>The Godawari Hacks Team</p>
        </div>
      `,
    };
  }

  return {
    subject: `Your registration status is now: ${status}`,
    html: `<p>Hello ${memberName}, your team status for <strong>${teamName}</strong> has been updated to <strong>${status}</strong>.</p>`,
  };
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("SANITY_WEBHOOK_SECRET is not configured");
    return NextResponse.json({error: "Webhook not configured"}, {status: 500});
  }

  const body = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);

  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({error: "Invalid signature"}, {status: 401});
  }

  let payload: StatusChangePayload;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({error: "Malformed payload"}, {status: 400});
  }

  const {teamName, status, members} = payload;
  if (!teamName || !status || !members?.length) {
    return NextResponse.json(
      {error: "Payload missing teamName, status, or members"},
      {status: 400},
    );
  }

  const recipients = members.filter(
    (member): member is {fullName: string; email: string} =>
      Boolean(member.email && member.fullName),
  );

  const results = await Promise.allSettled(
    recipients.map((member) => {
      const {subject, html} = buildEmail(member.fullName, teamName, status);
      return sendEmail({to: member.email, subject, html});
    }),
  );

  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length) {
    console.error(
      `Failed to send ${failed.length}/${recipients.length} status emails for ${teamName}`,
      failed,
    );
    // 500 so Sanity retries the delivery.
    return NextResponse.json(
      {error: "Some emails failed to send", sent: recipients.length - failed.length},
      {status: 500},
    );
  }

  return NextResponse.json({success: true, sent: recipients.length});
}
