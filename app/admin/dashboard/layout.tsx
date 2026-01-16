import { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/app/components/admin/AdminNav";
import { SignOutButton } from "@/app/components/admin/SignOutButton";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Admin Dashboard | Godawari Hacks",
  description: "Admin dashboard for managing team registrations",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full bg-white dark:bg-neutral-900 ${GeistMono.variable} ${GeistSans.variable}`}>
      <body className="h-full overflow-hidden font-sans">
        <div className="flex h-full">
          {/* Sidebar */}
          <aside className="hidden md:flex md:flex-shrink-0">
            <div className="flex w-64 flex-col">
              <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                  {/* Logo */}
                  <div className="flex flex-shrink-0 items-center px-4 mb-6">
                    <Link href="/" className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#084750] text-white font-bold text-lg">
                        GH
                      </div>
                      <div>
                        <h1 className="text-base font-bold text-gray-900 dark:text-white">
                          Godawari Hacks
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</p>
                      </div>
                    </Link>
                  </div>

                  {/* Navigation */}
                  <AdminNav />

                  {/* Sign Out at bottom */}
                  <div className="flex flex-shrink-0 border-t border-gray-200 dark:border-neutral-800 p-4">
                    <SignOutButton />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

