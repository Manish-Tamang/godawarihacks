import type { Metadata } from "next";
import "./globals.css";
import Navbar from "app/components/Navbar";
import { BgGradient } from "./components/BgGradient";
import { ThemeToggle } from "./components/ThemeToggle";
import { cx } from "./lib/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "Godawari Hack",
  description: "Join 30+ teams of passionate developers for an epic 24-hour coding marathon!",
  openGraph: {
    title: "Godawari Hack",
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
    title: "Godawari Hack",
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
      <body className="flex min-h-screen flex-col font-sans md:max-w-[880px] overflow-x-hidden overflow-y-auto lg:mx-auto bg-bg-primary dark:bg-neutral-900 transition-colors">

        <main className={cx("relative flex flex-1 flex-col min-h-0 bg-bg-primary dark:bg-neutral-900")}>
          <Navbar />
          <div className="grid flex-1 grid-cols-1 lg:grid-cols-[32px_1fr_32px] min-h-0 bg-bg-primary dark:bg-neutral-900">
            <div className="hidden w-full border-r border-border-primary dark:border-neutral-700 opacity-75 lg:block bg-bg-primary dark:bg-neutral-900"></div>
            <div className="relative col-span-1 px-3 lg:px-0 min-h-0 bg-bg-primary dark:bg-neutral-900">
              <BgGradient />
              {children}
            </div>
            <div className="hidden w-full border-l border-border-primary dark:border-neutral-700 opacity-75 lg:block bg-bg-primary dark:bg-neutral-900"></div>
          </div>
          {/* <ThemeToggle /> */}
        </main>
      </body>
    </html>
  );
}
