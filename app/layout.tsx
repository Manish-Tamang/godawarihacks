import type { Metadata } from "next";
import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://hack.godawari.edu.np"),
  title: {
    default: "Godawari Hacks - 24-Hour Highschool Hackathon in Nepal",
    template: "%s | Godawari Hacks",
  },
  description:
    "Join highschool teams of passionate students for an epic 24-hour coding hackathon at Sushma Godawari College, Itahari, Nepal. Compete for prizes worth over NRs. 1,00,000.",
  keywords: [
    "hackathon",
    "Nepal",
    "Itahari",
    "coding",
    "highschool hackathon",
    "Sushma Godawari College",
    "Godawari Hacks",
    "programming competition",
    "Koshi Province",
  ],
  authors: [{ name: "Manish Tamang", url: "https://manishtamang.com" }],
  creator: "Manish Tamang",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hack.godawari.edu.np",
    siteName: "Godawari Hacks",
    title: "Godawari Hacks - 24-Hour Highschool Hackathon in Nepal",
    description:
      "Join highschool teams of passionate students for an epic 24-hour coding hackathon at Sushma Godawari College, Itahari, Nepal.",
    images: [
      {
        url: "/logo-godawari-hacks.png",
        width: 1200,
        height: 630,
        alt: "Godawari Hacks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Godawari Hacks - 24-Hour Highschool Hackathon in Nepal",
    description:
      "Join highschool teams of passionate students for an epic 24-hour coding hackathon at Sushma Godawari College, Itahari, Nepal.",
    images: ["/logo-godawari-hacks.png"],
  },
  alternates: {
    canonical: "https://hack.godawari.edu.np",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`bg-bg-primary dark:bg-neutral-900 ${GeistMono.variable} ${GeistSans.variable}`}
    >
      <head>
        <link rel="canonical" href="https://hack.godawari.edu.np" />
      </head>
      <body className="flex min-h-screen flex-col font-sans bg-bg-primary dark:bg-neutral-900 transition-colors overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
