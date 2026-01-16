import { sendEmail } from "@/app/lib/mail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { name, email, subject, message, turnstileToken } = await request.json();

        // Basic validation
        if (!name || !email || !subject || !message || !turnstileToken) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify turnstile token
        const verifyResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
                    response: turnstileToken,
                }),
            }
        );

        const verifyData = await verifyResponse.json();

        if (!verifyData.success) {
            return NextResponse.json(
                { success: false, message: "Verification failed" },
                { status: 400 }
            );
        }

        // Send email to admin
        const adminEmailResult = await sendEmail({
            to: process.env.SMTP_USER!, // Send to the configured admin email
            subject: `New Contact Form Submission: ${subject}`,
            replyTo: email,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #084750; border-bottom: 2px solid #084750; padding-bottom: 10px;">New Message from Godawari Hacks</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 15px;">
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #777; margin-top: 20px;">This message was sent via the contact form on godawarihacks.com</p>
        </div>
      `,
        });

        if (!adminEmailResult.success) {
            throw new Error("Failed to send email");
        }

        // Optional: Send confirmation email to user
        await sendEmail({
            to: email,
            subject: "We received your message - Godawari Hacks",
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #084750;">Hello ${name},</h2>
          <p>Thank you for reaching out to Godawari Hacks! We have received your message and will get back to you as soon as possible.</p>
          <p>Here's a summary of what you sent:</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 15px;">
             <strong>Subject:</strong> ${subject}<br>
             <strong>Message:</strong><br>
             <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p>Best regards,<br>Team Godawari Hacks</p>
        </div>
      `,
        });

        return NextResponse.json(
            { success: true, message: "Message sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Contact API error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
