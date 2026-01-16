import { createClient } from "@/app/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/mail";

export async function PATCH(request: NextRequest) {
  try {
    const { teamId, status } = await request.json();

    if (!teamId || !status) {
      return NextResponse.json(
        { error: "Team ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "approved", "rejected", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if user is an admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", user.email)
      .eq("is_active", true)
      .single();

    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin privileges required" },
        { status: 403 }
      );
    }

    // Update team status
    const { data: team, error } = await supabase
      .from("teams")
      .update({ status })
      .eq("id", teamId)
      .select()
      .single();

    if (error) {
      console.error("Error updating team status:", error);
      return NextResponse.json(
        { error: "Failed to update team status" },
        { status: 500 }
      );
    }

    // Fetch team members to send notification emails
    const { data: members, error: membersError } = await supabase
      .from("team_members")
      .select("email, full_name")
      .eq("team_id", teamId);

    if (!membersError && members && members.length > 0) {
      // Send notification email to each member
      const emailPromises = members.map((member) => {
        let subject = "Update on your Godawari Hacks Registration";
        let message = "";

        if (status === "approved") {
          subject = "Congratulations! Your registration for Godawari Hacks is APPROVED! 🎉";
          message = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #084750; border-radius: 10px;">
              <h1 style="color: #084750; text-align: center;">Registration Approved!</h1>
              <p>Hello ${member.full_name},</p>
              <p>We are excited to inform you that your team <strong>${team.team_name}</strong> has been <strong>approved</strong> for Godawari Hacks!</p>
              <p>Get ready for an amazing hackathon experience. We will share further details regarding the event schedule and venue protocols soon.</p>
              <div style="background: #f0fdf4; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #16a34a;">
                <p style="margin: 0; color: #166534;"><strong>What's next?</strong> Keep an eye on your email for the participant guide and official Discord server invitation.</p>
              </div>
              <p>If you have any questions, feel free to reply to this email.</p>
              <p>Best regards,<br>The Godawari Hacks Team</p>
            </div>
          `;
        } else if (status === "rejected") {
          subject = "Update regarding your Godawari Hacks Registration";
          message = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #084750;">Registration Update</h2>
              <p>Hello ${member.full_name},</p>
              <p>Thank you for your interest in Godawari Hacks. We regret to inform you that your team <strong>${team.team_name}</strong> registration has been <strong>not been approved</strong> at this time.</p>
              <p>This could be due to incomplete documentation or payment verification issues. If you believe this is a mistake, please contact us immediately.</p>
              <p>Best regards,<br>The Godawari Hacks Team</p>
            </div>
          `;
        } else {
          subject = `Your registration status is now: ${status}`;
          message = `<p>Hello ${member.full_name}, your team status for <strong>${team.team_name}</strong> has been updated to <strong>${status}</strong>.</p>`;
        }

        return sendEmail({
          to: member.email,
          subject,
          html: message,
        });
      });

      // We don't necessarily want to wait for all emails to be sent before returning response
      // But for robustness we can await them or at least trigger them
      Promise.all(emailPromises).catch(err => console.error("Error sending bulk emails:", err));
    }

    return NextResponse.json(
      {
        success: true,
        team: team,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update team status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



