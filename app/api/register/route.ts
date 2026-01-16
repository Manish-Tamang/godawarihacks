import { createAdminClient } from "@/app/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const supabase = createAdminClient();

    // Extract team name
    const teamName = formData.get("teamName") as string;
    if (!teamName?.trim()) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 },
      );
    }

    // Extract member count
    const memberCount = parseInt(formData.get("memberCount") as string) || 3;
    if (memberCount < 1 || memberCount > 4) {
      return NextResponse.json(
        { error: "Team must have between 1 and 4 members" },
        { status: 400 },
      );
    }

    // Extract payment screenshot
    const paymentScreenshot = formData.get("paymentScreenshot") as File | null;
    if (!paymentScreenshot) {
      return NextResponse.json(
        { error: "Payment screenshot is required" },
        { status: 400 },
      );
    }

    // Validate payment screenshot file size (5MB)
    if (paymentScreenshot.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Payment screenshot exceeds 5MB limit" },
        { status: 400 },
      );
    }

    // Validate payment screenshot file type
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedImageTypes.includes(paymentScreenshot.type)) {
      return NextResponse.json(
        { error: "Invalid payment screenshot type. Only JPG, PNG allowed." },
        { status: 400 },
      );
    }

    // Extract member data
    const members: Array<{
      name: string;
      email: string;
      phone: string;
      documentType: string;
      document: File | null;
    }> = [];

    for (let i = 1; i <= memberCount; i++) {
      const name = formData.get(`member${i}_name`) as string;
      const email = formData.get(`member${i}_email`) as string;
      const phone = formData.get(`member${i}_phone`) as string;
      const documentType = formData.get(`member${i}_documentType`) as string;
      const document = formData.get(`member${i}_document`) as File | null;

      if (!name || !email || !phone || !documentType || !document) {
        return NextResponse.json(
          { error: `All fields are required for member ${i}` },
          { status: 400 },
        );
      }

      // Validate file size (5MB)
      if (document.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `Document for member ${i} exceeds 5MB limit` },
          { status: 400 },
        );
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(document.type)) {
        return NextResponse.json(
          {
            error: `Invalid file type for member ${i}. Only PDF, JPG, PNG allowed.`,
          },
          { status: 400 },
        );
      }

      members.push({ name, email, phone, documentType, document });
    }

    // Create team in database
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        team_name: teamName.trim(),
        status: "pending",
      })
      .select()
      .single();

    if (teamError || !team) {
      console.error("Error creating team:", teamError);
      return NextResponse.json(
        { error: "Failed to create team registration" },
        { status: 500 },
      );
    }

    // Upload payment screenshot first
    const paymentFileExt = paymentScreenshot.name.split(".").pop();
    const paymentFileName = `payment_${Date.now()}.${paymentFileExt}`;
    const paymentFilePath = `payments/${team.id}/${paymentFileName}`;

    const paymentArrayBuffer = await paymentScreenshot.arrayBuffer();
    const paymentBuffer = Buffer.from(paymentArrayBuffer);

    const { error: paymentUploadError } = await supabase.storage
      .from("payment-screenshots")
      .upload(paymentFilePath, paymentBuffer, {
        contentType: paymentScreenshot.type,
        upsert: false,
      });

    if (paymentUploadError) {
      console.error("Error uploading payment screenshot:", paymentUploadError);
      // Clean up: delete team if payment upload fails
      await supabase.from("teams").delete().eq("id", team.id);
      return NextResponse.json(
        { error: "Failed to upload payment screenshot" },
        { status: 500 },
      );
    }

    // Get payment screenshot public URL
    const { data: paymentUrlData } = supabase.storage
      .from("payment-screenshots")
      .getPublicUrl(paymentFilePath);

    // Update team with payment screenshot info
    const { error: updateTeamError } = await supabase
      .from("teams")
      .update({
        payment_screenshot_url: paymentUrlData.publicUrl,
        payment_screenshot_path: paymentFilePath,
        payment_verified: false,
      })
      .eq("id", team.id);

    if (updateTeamError) {
      console.error("Error updating team with payment info:", updateTeamError);
      // Clean up
      await supabase.from("teams").delete().eq("id", team.id);
      return NextResponse.json(
        { error: "Failed to save payment information" },
        { status: 500 },
      );
    }

    // Upload documents and create team members
    interface TeamMemberResponse {
      full_name: string;
      email: string;
      phone: string;
    }
    const teamMembers: TeamMemberResponse[] = [];
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const file = member.document!;

      // Generate file path: registrations/{team_id}/member{i+1}_{filename}
      const fileExt = file.name.split(".").pop();
      const fileName = `member${i + 1}_${Date.now()}.${fileExt}`;
      const filePath = `registrations/${team.id}/${fileName}`;

      // Convert File to ArrayBuffer for upload
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("team-documents")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading document:", uploadError);
        // Clean up: delete team if document upload fails
        await supabase.from("teams").delete().eq("id", team.id);
        return NextResponse.json(
          { error: `Failed to upload document for member ${i + 1}` },
          { status: 500 },
        );
      }

      // Get public URL (or signed URL for private buckets)
      const { data: urlData } = supabase.storage
        .from("team-documents")
        .getPublicUrl(filePath);

      // Create team member record
      const { data: teamMember, error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: team.id,
          member_number: i + 1,
          full_name: member.name.trim(),
          email: member.email.toLowerCase().trim(),
          phone: member.phone.trim(),
          document_type: member.documentType,
          document_url: urlData.publicUrl,
          document_path: filePath,
        })
        .select()
        .single();

      if (memberError || !teamMember) {
        console.error("Error creating team member:", memberError);
        // Clean up: delete team and uploaded documents
        await supabase.from("teams").delete().eq("id", team.id);
        // Note: Storage cleanup would require listing and deleting files
        return NextResponse.json(
          { error: `Failed to create member ${i + 1} record` },
          { status: 500 },
        );
      }

      teamMembers.push({
        full_name: teamMember.full_name,
        email: teamMember.email,
        phone: teamMember.phone,
      });
    }

    // Send confirmation emails to all team members
    const emailPromises = teamMembers.map((member) => {
      return sendEmail({
        to: member.email,
        subject: `Registration Received - Godawari Hacks`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #084750; text-align: center;">Registration Received!</h1>
            <p>Hello ${member.full_name},</p>
            <p>Thank you for registering your team <strong>${team.team_name}</strong> for Godawari Hacks!</p>
            <p>We have received your registration details and payment screenshot. Our team will review your submission and update your status within 24-48 hours.</p>
            <div style="background: #fdfaf0; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;"><strong>Status:</strong> Your registration is currently <strong>Pending Review</strong>.</p>
            </div>
            <p>Once approved, you will receive another email with further instructions and an invitation to our official Discord server.</p>
            <p>Best regards,<br>The Godawari Hacks Team</p>
          </div>
        `,
      });
    });

    // Fire and forget email sending (or at least don't block the UI response too much)
    Promise.all(emailPromises).catch(err => console.error("Error sending registration confirmation emails:", err));

    return NextResponse.json(
      {
        success: true,
        message: "Team registration successful",
        team: {
          id: team.id,
          team_name: team.team_name,
          status: team.status,
          registration_date: team.registration_date,
        },
        members: teamMembers.map((m) => ({
          name: m.full_name,
          email: m.email,
          phone: m.phone,
        })),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
