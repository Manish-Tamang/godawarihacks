import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Details | Admin Dashboard",
  description: "View team details and member information",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
