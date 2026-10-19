import { GridWrapper } from "./components/GridWrapper";
import { Stats } from "./components/Stats";
import { Schedule } from "./components/Schedule";
import { Sponsors } from "./components/Sponsors";
import { HackathonDiaries } from "./components/HackathonDiaries";
import { Team } from "./components/Team";
import { InstagramFeed } from "./components/InstagramFeed";
import { About } from "./components/About";
import { CollegeAbout } from "./components/CollegeAbout";
import { PhotoGrid } from "./components/PhotoGrid";
import { RegisterSection } from "./components/RegisterSection";
import { Commitment } from "./components/Commitment";
import { PrizePool } from "./components/PrizePool";
import { Venue } from "./components/Venue";
import { Hero } from "./components/Hero";
import { MainSiteLayout } from "./components/MainSiteLayout";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import type { RichTextValue } from "@/sanity/lib/portable-text";
import { toPlainText } from "@/sanity/lib/portable-text";
import { urlFor } from "@/sanity/lib/image";
import type { Event, WithContext } from "schema-dts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

type SanityImage = {
  asset?: {
    _id: string;
    url: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width: number; height: number };
    };
  };
  alt?: string;
} | null;

type HomePageData = {
  title?: string;
  tagline?: RichTextValue;
  subtitle?: RichTextValue;
  heroBackground?: SanityImage;
  collegeName?: string;
  collegeLogo?: SanityImage;
  collegeUrl?: string;
  startDate?: string;
  endDate?: string;
  registrationStatus?: string;
  stats?: Array<{ _key: string; number: string; label: string }>;
  commitment?: {
    title?: string;
    description?: RichTextValue;
    partners?: Array<{
      _key: string;
      name: string;
      logo?: { asset?: { _id: string; url: string }; alt?: string } | null;
      url?: string;
    }>;
  };
  prizePool?: {
    title?: string;
    description?: RichTextValue;
    prizes?: Array<{
      _key: string;
      title: string;
      amount?: string;
      description?: string;
      icon?: { asset?: { _id: string; url: string } } | null;
      gradientFrom?: string;
      gradientTo?: string;
    }>;
  };
  about?: {
    title?: string;
    description?: RichTextValue;
    values?: Array<{ _key: string; title: string; description?: RichTextValue }>;
    expectations?: Array<{ _key: string; text: string }>;
  };
  photoGallery?: {
    title?: string;
    description?: string;
    photos?: Array<{
      _key: string;
      alt?: string;
      caption?: string;
      hotspot?: { x: number; y: number; height: number; width: number };
      crop?: { top: number; bottom: number; left: number; right: number };
      asset?: {
        _id: string;
        url: string;
        metadata?: { lqip?: string; dimensions?: { width: number; height: number } };
      };
    }>;
  };
  schedule?: ScheduleEventData[];
  venue?: VenueData;
  team?: TeamMemberData[];
  sponsors?: SponsorData[];
} | null;

type SponsorData = {
  _id: string;
  name: string;
  logo?: SanityImage;
  url?: string;
  tier?: string;
};

type ScheduleEventData = {
  _id: string;
  title: string;
  day: string;
  time: string;
  description?: RichTextValue;
  location?: string;
  image?: SanityImage;
};

type VenueData = {
  _id: string;
  name: string;
  address?: string;
  city?: string;
  dates?: string;
  plusCode?: string;
  landmark?: string;
  mapUrl?: string;
  image?: SanityImage;
} | null;

type TeamMemberData = {
  _id: string;
  name: string;
  role: string;
  faculty?: string;
  image?: SanityImage;
  linkedin?: string;
  github?: string;
  instagram?: string;
};

export default async function Home() {
  const STATS_DELAY = 0.4;

  const homePage = await sanityFetch<HomePageData>({
    query: HOME_PAGE_QUERY,
    tags: ["homePage", "sponsor", "scheduleEvent", "venue", "teamMember"],
  });
  const sponsors = homePage?.sponsors;
  const scheduleEvents = homePage?.schedule;
  const venue = homePage?.venue;
  const teamMembers = homePage?.team;

  const isRegistrationOpen = homePage?.registrationStatus === "open";

  const heroBg = homePage?.heroBackground;
  const heroBgSrc = heroBg?.asset
    ? urlFor(heroBg).width(2300).auto("format").quality(80).url()
    : "/bg-hero.jpg";
  const heroBgDimensions = heroBg?.asset?.metadata?.dimensions;
  const heroBgWidth = heroBgDimensions?.width ?? 4032;
  const heroBgHeight = heroBgDimensions?.height ?? 1131;

  const jsonLd: WithContext<Event> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: homePage?.title || "Godawari Hacks",
    description: toPlainText(homePage?.tagline) || "Join highschool teams of passionate students for an epic 24-hour coding hackathon.",
    startDate: homePage?.startDate || "2026-01-18T09:00:00+05:45",
    endDate: homePage?.endDate || "2026-01-19T17:30:00+05:45",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: venue?.name || "Sushma Godawari College",
      address: {
        "@type": "PostalAddress",
        addressLocality: venue?.city || "Itahari",
        addressCountry: "NP",
        streetAddress: venue?.address || "Itahari-6, Sunsari",
      },
    },
    organizer: {
      "@type": "Organization",
      name: homePage?.collegeName || "Sushma Godawari College",
      url: homePage?.collegeUrl || "https://www.facebook.com/sushmagodawari",
    },
    image: "https://hack.godawari.edu.np/logo-godawari-hacks.png",
    url: "https://hack.godawari.edu.np",
  };

  return (
    <div className="relative isolate">
      <div className="pointer-events-none -mt-4 absolute inset-x-0 top-0 -z-10 mx-auto w-full max-w-[1150px] overflow-hidden">
        <Image
          src={heroBgSrc}
          alt={heroBg?.alt || ""}
          width={heroBgWidth}
          height={heroBgHeight}
          priority
          sizes="(max-width: 1150px) 100vw, 1150px"
          className="block h-auto w-full grayscale-[50%] [mask-image:linear-gradient(to_bottom,black_0%,black_35%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_35%,transparent_100%)]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/30 to-bg-primary dark:via-neutral-900/30 dark:to-neutral-900" />
      </div>
      <MainSiteLayout>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <section className="space-y-10 md:space-y-16 pb-0">
          <Hero
            title={homePage?.title}
            tagline={homePage?.tagline}
            subtitle={homePage?.subtitle}
            collegeName={homePage?.collegeName}
            collegeUrl={homePage?.collegeUrl}
            isRegistrationOpen={isRegistrationOpen}
          />
        <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <PhotoGrid />
        </section>
        <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <Stats delay={STATS_DELAY} stats={homePage?.stats} />
        </section>
        <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <RegisterSection />
        </section>
        <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <Commitment
            title={homePage?.commitment?.title}
            description={homePage?.commitment?.description}
            partners={homePage?.commitment?.partners}
          />
        </section>
        <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <PrizePool
            title={homePage?.prizePool?.title}
            description={homePage?.prizePool?.description}
            prizes={homePage?.prizePool?.prizes}
          />
        </section>
        <section id="venue" className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <Venue venue={venue} />
        </section>
        <section id="about" className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <About
            title={homePage?.about?.title}
            description={homePage?.about?.description}
            values={homePage?.about?.values}
            expectations={homePage?.about?.expectations}
          />
        </section>
        <section id="college" className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <CollegeAbout />
        </section>
        <section id="diaries" className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <HackathonDiaries gallery={homePage?.photoGallery} />
        </section>
        <section id="schedule" className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <Schedule events={scheduleEvents} />
        </section>
        <section id="sponsors" className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <Sponsors sponsors={sponsors} />
        </section>
        <section id="team" className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <Team members={teamMembers} />
        </section>
        <section id="instagram" className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <InstagramFeed />
        </section>
        <section id="contact" className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <div className="text-center space-y-6 -mt-8">
            <h2 className="text-3xl -mb-4 md:text-4xl font-bold text-text-primary">
              Ready to Code?
            </h2>
            <p className="text-lg md:text-xl text-text-secondary">
              Register now and be part of the most exciting hackathon of the year!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/register"
                className="px-8 py-4 mb-4 bg-[#084750] text-white font-semibold rounded-square hover:bg-[#084750]/80 transition-colors"
              >
                Register Now
              </a>
              <a
                href="/about"
                className="px-8 py-4 mb-4 border-2 border-border-primary text-text-primary font-semibold rounded-square hover:bg-gray-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
        <section className="relative space-y-8 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <GridWrapper>
            <div className="py-8 md:py-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 px-4">
                <div className="flex-1 space-y-3">
                  <p className="text-sm md:text-base text-text-secondary">
                    If you are wondering who made this site, it is made by{" "}
                    <a
                      href="https://manishtamang.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#084750] hover:text-[#084750]/80 underline font-medium"
                    >
                      golecodes
                    </a>
                  </p>
                  <p className="text-sm md:text-base text-text-tertiary leading-relaxed">
                    A +2 Science graduate of Sushma Godawari College (2024–2026 batch), passionate about full stack web app development.
                  </p>
                </div>
                <div className="flex-shrink-0 bg-gray-100 mr-2">
                  <Image
                    src="/profile.png"
                    alt="golecodes"
                    width={120}
                    height={120}
                    className="rounded-square object-cover border border-primary/50 select-none"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </GridWrapper>
        </section>
      </section>
    </MainSiteLayout>
    </div>
  );
}
