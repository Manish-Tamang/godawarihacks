import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Hack Sushma",
  description: "Register your team of 3 members for Hack Sushma. Join us for an epic 12-hour coding marathon!",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


