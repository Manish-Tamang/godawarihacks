import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Godawari Hack",
  description: "Get in touch with the Godawari Hack team. Have questions about the hackathon, sponsorship, or volunteering? We'd love to hear from you!",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


