import { createAdminClient } from "@/app/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, fullName, role } = await request.json();

    // Validate input
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, password, and full name are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // Create Supabase admin client (bypasses RLS)
    const supabase = createAdminClient();

    // Create user in Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          full_name: fullName,
          role: role || "admin",
        },
      });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        {
          error: authError.message || "Failed to create user in authentication",
        },
        { status: 400 },
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "User creation failed - no user data returned" },
        { status: 500 },
      );
    }

    // Insert into admin_users table
    // Note: If password_hash column is NOT NULL, we use a placeholder
    const { error: dbError } = await supabase.from("admin_users").insert({
      email: email.toLowerCase().trim(),
      full_name: fullName,
      role: role || "admin",
      is_active: true,
      password_hash: "supabase_auth", // Placeholder - we use Supabase Auth for authentication
    });

    if (dbError) {
      // If database insert fails, try to delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);

      // Check if it's a duplicate email error
      if (dbError.code === "23505") {
        return NextResponse.json(
          { error: "An admin user with this email already exists" },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { error: dbError.message || "Failed to create admin user record" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Admin user created successfully",
        user: {
          id: authData.user.id,
          email: authData.user.email,
          fullName,
          role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
