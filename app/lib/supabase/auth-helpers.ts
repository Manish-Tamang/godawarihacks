import { createClient } from "./server";
import { redirect } from "next/navigation";

/**
 * Check if the current user is an authenticated admin
 * Returns admin user data if authenticated, null otherwise
 */
export async function getAdminUser() {
  try {
    const supabase = await createClient();
    
    // Get current user from Supabase Auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return null;
    }

    // Check if user exists in admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("id, email, full_name, role, is_active")
      .eq("email", user.email)
      .eq("is_active", true)
      .single();

    if (adminError || !adminUser) {
      return null;
    }

    return adminUser;
  } catch (error) {
    console.error("Error checking admin user:", error);
    return null;
  }
}

/**
 * Require admin authentication - redirects to sign-in if not authenticated
 */
export async function requireAdmin() {
  const adminUser = await getAdminUser();
  
  if (!adminUser) {
    redirect("/admin/signin");
  }
  
  return adminUser;
}

