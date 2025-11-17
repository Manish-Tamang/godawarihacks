import type { Metadata } from "next";
import "./globals.css";
import Navbar from "app/components/Navbar";
import { BgGradient } from "./components/BgGradient";
import { cx } from "./lib/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "Sushma Code fest - December 3, 2024",
  description: "Join 20+ teams of passionate developers for an epic 12-hour coding marathon! December 3, 2024 • 3-day session of innovation, collaboration, and code.",
  openGraph: {
    title: "Sushma Code fest - December 3, 2024",
    description: "Join 20+ teams of passionate developers for an epic 12-hour coding marathon! December 3, 2024 • 3-day session of innovation, collaboration, and code.",
    images: [
      {
        url: "/braydon_coyer_blogfolio_og.jpg",
        width: 1200,
        height: 630,
        alt: "Sushma Code fest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sushma Code fest - December 3, 2024",
    description: "Join 20+ teams of passionate developers for an epic 12-hour coding marathon! December 3, 2024 • 3-day session of innovation, collaboration, and code.",
    images: ["/braydon_coyer_blogfolio_og.jpg"],
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
      className={`bg-bg-primary ${GeistMono.variable} ${GeistSans.variable}`}
    >
      <body className="flex min-h-screen flex-col font-sans md:max-w-[880px] overflow-x-hidden overflow-y-auto lg:mx-auto lg:flex-row">

        <main className={cx("relative flex flex-1 flex-col min-h-0")}>
          <Navbar />
          <div className="grid flex-1 grid-cols-1 lg:grid-cols-[32px_1fr_32px] min-h-0">
            <div className="hidden w-full border-r border-border-primary opacity-75 lg:block"></div>
            <div className="relative col-span-1 px-3 lg:px-0 min-h-0">
              <BgGradient />
              {children}
            </div>
            <div className="hidden w-full border-l border-border-primary opacity-75 lg:block"></div>
          </div>
          {/* <Footer /> */}
        </main>
      </body>
    </html>
  );
}
