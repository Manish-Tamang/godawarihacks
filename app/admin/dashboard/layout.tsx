import { Metadata } from "next";
import Link from "next/link";
import { SignOutButton } from "@/app/components/admin/SignOutButton";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Admin Dashboard | Hack Sushma",
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
                          Godawari Hack
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</p>
                      </div>
                    </Link>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 space-y-1 px-3">
                    <Link
                      href="/admin/dashboard"
                      className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-white bg-[#084750]"
                    >
                      <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </Link>

                    <Link
                      href="/"
                      className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    >
                      <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Site
                    </Link>
                  </nav>

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

