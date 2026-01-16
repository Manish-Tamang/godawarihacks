import { createClient } from "@/app/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/mail";

export async function POST(request: NextRequest) {
    try {
        const { to, subject, html } = await request.json();

        if (!to || !subject || !html) {
            return NextResponse.json(
                { error: "To, subject, and html are required" },
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

        // Send custom email
        const result = await sendEmail({
            to,
            subject,
            html,
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error instanceof Error ? result.error.message : "Failed to send email" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Email sent successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Send custom email error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
