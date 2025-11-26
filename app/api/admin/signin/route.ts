import { createClient } from "@/app/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user is an admin
    const normalizedEmail = email.toLowerCase().trim();
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("id, email, full_name, role, is_active")
      .eq("email", normalizedEmail)
      .single();

    if (adminError) {
      console.error("Admin check error:", adminError);
      // Sign out if not an admin
      await supabase.auth.signOut();
      
      // Provide more helpful error message
      if (adminError.code === "PGRST116") {
        // No rows returned
        return NextResponse.json(
          { 
            error: "Admin account not found. Please create an admin user first at /admin/create-admin or contact the administrator.",
            details: `No admin user found with email: ${normalizedEmail}`
          },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { 
          error: "Access denied. Admin privileges required.",
          details: adminError.message
        },
        { status: 403 }
      );
    }

    if (!adminUser) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { 
          error: "Admin account not found. Please create an admin user first at /admin/create-admin.",
          details: `No admin user found with email: ${normalizedEmail}`
        },
        { status: 403 }
      );
    }

    if (!adminUser.is_active) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Your admin account has been deactivated. Please contact the administrator." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          full_name: adminUser.full_name,
          role: adminUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

