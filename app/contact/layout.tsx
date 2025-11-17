import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Hack Sushma",
  description: "Get in touch with the Hack Sushma team. Have questions about the hackathon, sponsorship, or volunteering? We'd love to hear from you!",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


