import type { Metadata } from "next";
import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Godawari Hacks",
  description: "Join 30+ teams of passionate developers for an epic 24-hour coding marathon!",
  openGraph: {
    title: "Godawari Hacks",
    description: "Join 30+ teams of passionate developers for an epic 24-hour coding marathon!.",
    images: [
      {
        url: "/sushma-logo.jpg",
        width: 1200,
        height: 630,
        alt: "Hack Sushma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Godawari Hacks",
    description: "Join 30+ teams of passionate developers for an epic 24-hour coding marathon!.",
    images: ["/sushma-logo.jpg"],
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
      <body className="flex min-h-screen flex-col font-sans bg-bg-primary dark:bg-neutral-900 transition-colors">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
