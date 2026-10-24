import { GridPageLayout } from "./components/GridPageLayout";
import { Hero } from "./components/Hero";
import { PhotoGrid } from "./components/PhotoGrid";
import { Stats } from "./components/Stats";
import { RegisterSection } from "./components/RegisterSection";
import { Commitment } from "./components/Commitment";
import { PrizePool } from "./components/PrizePool";
import { Venue } from "./components/Venue";
import { About } from "./components/About";
import { CollegeAbout } from "./components/CollegeAbout";
import { HackathonDiaries } from "./components/HackathonDiaries";
import { Schedule } from "./components/Schedule";
import { Sponsors } from "./components/Sponsors";
import { Team } from "./components/Team";
import { InstagramFeed } from "./components/InstagramFeed";
import { CallToAction } from "./components/CallToAction";
import { MadeBy } from "./components/MadeBy";
import { GridSection } from "./components/ui/grid-section";
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
    values?: Array<{
      _key: string;
      title: string;
      description?: RichTextValue;
    }>;
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
        metadata?: {
          lqip?: string;
          dimensions?: { width: number; height: number };
        };
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
    description:
      toPlainText(homePage?.tagline) ||
      "Join highschool teams of passionate students for an epic 24-hour coding hackathon.",
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
    <GridPageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        title={homePage?.title}
        tagline={homePage?.tagline}
        subtitle={homePage?.subtitle}
        collegeName={homePage?.collegeName}
        collegeUrl={homePage?.collegeUrl}
        isRegistrationOpen={isRegistrationOpen}
        background={{
          src: heroBgSrc,
          width: heroBgWidth,
          height: heroBgHeight,
          alt: heroBg?.alt,
        }}
      />
      <PhotoGrid />
      <Stats stats={homePage?.stats} />
      <RegisterSection />
      <Commitment
        title={homePage?.commitment?.title}
        description={homePage?.commitment?.description}
        partners={homePage?.commitment?.partners}
      />
      <PrizePool
        title={homePage?.prizePool?.title}
        description={homePage?.prizePool?.description}
        prizes={homePage?.prizePool?.prizes}
      />
      <Venue venue={venue} />
      <About
        title={homePage?.about?.title}
        description={homePage?.about?.description}
        values={homePage?.about?.values}
        expectations={homePage?.about?.expectations}
      />
      <CollegeAbout />
      <HackathonDiaries gallery={homePage?.photoGallery} />
      <Schedule events={scheduleEvents} />
      <Sponsors sponsors={sponsors} />
      {/* Team is shared with /about, so the band lives here rather than inside it. */}
      <GridSection id="team" innerClassName="pt-20">
        <Team
          title="Meet the team"
          description="The students building Godawari Hacks 26/27, from planning and partnerships to logistics and tech, working to make this edition our biggest one yet."
          members={teamMembers}
        />
      </GridSection>
      <InstagramFeed />
      <CallToAction />
      <MadeBy />
    </GridPageLayout>
  );
}
