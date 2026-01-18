import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Review - Godawari Hacks",
    description: "Get in touch with the Godawari Hacks team. Have questions about the hackathon, sponsorship, or volunteering? We'd love to hear from you!",
};

export default function ReviewLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}


