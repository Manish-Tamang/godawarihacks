import { type NextRequest } from "next/server";
import { updateSession } from "./app/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Proxy error:", error);
    }
    return undefined;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static files (images, etc.)
     * - api/register, api/contact (public APIs)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/register|api/contact).*)",
  ],
};
