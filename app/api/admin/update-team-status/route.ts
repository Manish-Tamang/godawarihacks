import { createClient } from "@/app/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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
    const { data, error } = await supabase
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

    return NextResponse.json(
      {
        success: true,
        team: data,
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



