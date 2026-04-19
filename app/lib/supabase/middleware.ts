import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if accessing admin routes (except signin and create-admin)
  const isAdminRoute =
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/signin") &&
    !pathname.startsWith("/admin/create-admin");

  // Only check auth for admin routes - skip for other routes
  if (!isAdminRoute) {
    return NextResponse.next({
      request,
    });
  }

  // Check if Supabase environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env vars are not set, redirect to sign-in
  if (!supabaseUrl || !supabaseAnonKey) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/signin";
    return NextResponse.redirect(url);
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Refresh session if expired
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // If not authenticated, redirect to sign-in
    if (!user || userError) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/signin";
      return NextResponse.redirect(url);
    }

    // Check if user is an admin
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("id, email, is_active")
      .eq("email", user.email)
      .eq("is_active", true)
      .single();

    // If not an admin, redirect to sign-in
    if (adminError || !adminUser) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/signin";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    // Log only in development to avoid spam
    if (process.env.NODE_ENV === "development") {
      console.error("Supabase auth error in middleware:", error);
    }

    // On error, redirect to sign-in
    const url = request.nextUrl.clone();
    url.pathname = "/admin/signin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
