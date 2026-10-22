import type { Metadata } from "next";
import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import type { Organization, WithContext } from "schema-dts";
import { siteMetadata } from "@/app/data/siteMetadata";

// Inter for body copy, Satoshi for headings (`font-display`).
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
});

// Site-wide entity. Lets search engines tie the site, its logo and its social
// profiles to one organisation rather than treating each page as unrelated.
const organizationJsonLd: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Godawari Hacks",
  url: siteMetadata.siteUrl,
  logo: `${siteMetadata.siteUrl}/logo-godawari-hacks.png`,
  description: siteMetadata.description,
  email: "hack@godawari.edu.np",
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "Sushma Godawari College",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Itahari",
      addressRegion: "Koshi Province",
      addressCountry: "NP",
    },
  },
  sameAs: [
    "https://www.instagram.com/godawarihacks/",
    "https://github.com/Godawari-Hacks",
    "https://www.facebook.com/profile.php?id=61586598928514",
  ],
};

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
      className={`bg-white ${GeistMono.variable} ${inter.variable} ${satoshi.variable}`}
    >
      <body className="flex min-h-screen flex-col overflow-x-hidden bg-white font-sans text-neutral-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
