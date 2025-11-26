import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In - Hack Sushma",
  description: "Admin panel sign in page for Hack Sushma administrators.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

