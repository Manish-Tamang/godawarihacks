import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Godawari hack",
  description: "Register your team of 4 members for Godawari hack. Join us for an epic 24-hour coding marathon!",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


