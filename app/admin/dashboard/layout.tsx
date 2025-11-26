import { Metadata } from "next";

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
  return children;
}

