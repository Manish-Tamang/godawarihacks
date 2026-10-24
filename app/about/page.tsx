import { GridPageLayout } from "../components/GridPageLayout";
import { GridSection } from "../components/ui/grid-section";
import { SplitHeading } from "../components/ui/split-heading";
import { CheckList } from "../components/ui/check-list";
import { Team } from "../components/Team";
import { FeaturedIn, type PressMention } from "../components/FeaturedIn";
import { cn } from "../lib/utils";
import Image from "next/image";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PortableTextContent } from "../components/PortableTextContent";
import type { RichTextValue } from "@/sanity/lib/portable-text";

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

type AboutValue = { _key: string; title: string; description?: RichTextValue };
type Expectation = { _key: string; text: string };

type FoundingMember = {
  _id: string;
  name: string;
  role?: string | null;
  image?: SanityImage;
};

type AboutPageData = {
  about?: {
    title?: string;
    subtitle?: string;
    heroImage?: SanityImage;
    heroImageSecondary?: SanityImage;
    heroImageTertiary?: SanityImage;
    missionTitle?: string;
    mission?: RichTextValue;
    valuesTitle?: string;
    values?: AboutValue[];
    expectationsTitle?: string;
    expectations?: Expectation[];
    bannerTitle?: string;
    bannerDescription?: string;
    bannerImage?: SanityImage;
    foundingTeamTitle?: string;
    foundingTeamDescription?: string;
    foundingTeam?: FoundingMember[];
    featuredTitle?: string;
    featuredIn?: PressMention[];
    seo?: { title?: string; description?: string; noIndex?: boolean };
  } | null;
  homeAbout?: {
    values?: AboutValue[];
    expectations?: Expectation[];
  } | null;
} | null;

const DEFAULT_DESCRIPTION =
  "Learn about Godawari Hacks, our mission, values, and what makes our hackathon special. Join a community-driven event that brings together passionate developers.";

const DEFAULT_EXPECTATIONS: Expectation[] = [
  { _key: "e1", text: "24 hours of intense coding and problem-solving" },
  { _key: "e2", text: "Networking opportunities with fellow developers" },
  { _key: "e3", text: "Mentorship from industry experts" },
  { _key: "e4", text: "Prizes and recognition for winning teams" },
];

async function getAboutPage() {
  return sanityFetch<AboutPageData>({
    query: ABOUT_PAGE_QUERY,
    tags: ["aboutPage", "homePage"],
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const about = (await getAboutPage())?.about;

  return {
    title: about?.seo?.title || "About",
    description: about?.seo?.description || DEFAULT_DESCRIPTION,
    alternates: { canonical: "/about" },
    ...(about?.seo?.noIndex ? { robots: "noindex" } : {}),
  };
}

// Staggered entrance shared by the hero and the value cards.
const REVEAL =
  "animate-slide-up-fade [--offset:10px] [animation-duration:1s] [animation-fill-mode:both] motion-reduce:animate-fade-in";

export default async function AboutPage() {
  const data = await getAboutPage();
  const about = data?.about;

  const values = about?.values?.length
    ? about.values
    : (data?.homeAbout?.values ?? []);
  const expectations = about?.expectations?.length
    ? about.expectations
    : data?.homeAbout?.expectations?.length
      ? data.homeAbout.expectations
      : DEFAULT_EXPECTATIONS;
  const foundingTeam = about?.foundingTeam ?? [];
  const press = about?.featuredIn ?? [];

  const [heroMain, heroTop, heroBottom] = [
    photoFrom(about?.heroImage, "/hackathon/bg.jpg", 1400),
    photoFrom(about?.heroImageSecondary, "/hackathon/team-godawari.jpg", 800),
    photoFrom(about?.heroImageTertiary, "/hackathon/team-sushma.jpg", 800),
  ];

  const banner = photoFrom(
    about?.bannerImage,
    "/hackathon/615441793_1496629622471458_2605852539031229038_n.jpg",
    1400,
  );

  return (
    <GridPageLayout>
      <section className="grid-section relative overflow-clip border-b border-grid-border px-4">
        <div className="relative z-0 mx-auto max-w-grid-width px-5 pb-10 pt-16 sm:pt-20">
          <div className="pointer-events-none absolute inset-0 border-x border-grid-border [mask-image:linear-gradient(transparent,black)]" />
          <div className="flex max-w-[700px] flex-col gap-2">
            <h1
              className={`max-w-[660px] text-balance text-[32px] font-medium leading-[1.2] tracking-[-0.03em] text-neutral-900 sm:text-[40px] ${REVEAL}`}
            >
              {about?.title || "About Godawari Hacks"}
            </h1>
            <p
              className={`max-w-[420px] text-pretty text-base tracking-[-0.02em] text-neutral-600 [animation-delay:100ms] ${REVEAL}`}
            >
              {about?.subtitle ||
                "A student organized hackathon that brings together passionate students to build, learn, and innovate together."}
            </p>
          </div>
          {/* One large photo with two stacked beside it; on mobile
                        the pair sits side by side under the large one. */}
          <div
            className={`relative mt-10 grid grid-cols-2 gap-3 [animation-delay:200ms] md:flex md:gap-5 ${REVEAL}`}
          >
            <RoundedPhoto
              photo={heroMain}
              priority
              sizes="(min-width: 1120px) 659px, (min-width: 768px) 63vw, 100vw"
              className="col-span-2 aspect-[323/220] md:aspect-[659/441] md:flex-1"
            />
            <div className="contents md:flex md:w-[34.7%] md:shrink-0 md:flex-col md:gap-5">
              <RoundedPhoto
                photo={heroTop}
                sizes="(min-width: 1120px) 361px, (min-width: 768px) 35vw, 50vw"
                className="aspect-[4/3] md:aspect-auto md:flex-1"
              />
              <RoundedPhoto
                photo={heroBottom}
                sizes="(min-width: 1120px) 361px, (min-width: 768px) 35vw, 50vw"
                className="aspect-[4/3] md:aspect-auto md:flex-1"
              />
            </div>
          </div>
        </div>
      </section>

      {values.length > 0 && (
        <GridSection id="values">
          <div className="relative flex flex-col items-center gap-4 px-5 pb-12 pt-16 text-center sm:px-10">
            {/* Soft sky glow behind the heading. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[113px] h-[312px] w-[564px] max-w-full -translate-x-1/2 bg-[radial-gradient(closest-side,theme(colors.sky.200),theme(colors.sky.100)_45%,transparent)] opacity-70"
            />
            <FlagIcon className="relative size-6 text-neutral-200" />
            <h2 className="relative text-3xl font-medium tracking-[-0.02em] text-neutral-900">
              {about?.valuesTitle || "What We Stand For"}
            </h2>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 sm:pb-[72px]">
            {values.map((value, index) => {
              const isRight = index % 2 === 1;
              const isLastLeft = !isRight && index >= values.length - 2;
              return (
                <div
                  key={value._key}
                  className={cn(
                    "relative border-t border-grid-border bg-white/45 p-8 backdrop-blur-md lg:p-12",
                    isRight
                      ? "sm:-ml-px sm:translate-y-[72px] sm:border-l"
                      : "sm:border-r",
                    isLastLeft && "sm:border-b",
                  )}
                >
                  <div
                    className={REVEAL}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="block py-[7px] text-base font-medium leading-6 tracking-[-0.02em] text-neutral-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-8 text-2xl font-medium leading-8 tracking-[-0.02em] text-neutral-900">
                      {value.title}
                    </h3>
                    {value.description ? (
                      <div className="mt-6 text-pretty text-base leading-6 tracking-[-0.02em] text-neutral-900/60">
                        <PortableTextContent value={value.description} />
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </GridSection>
      )}

      <GridSection id="mission" innerClassName="px-5 pb-16 pt-16">
        <SplitHeading title={about?.missionTitle || "Our Mission"}>
          <div className="space-y-4">
            {about?.mission?.length ? (
              <PortableTextContent value={about.mission} />
            ) : (
              <>
                <p>
                  Godawari Hacks was founded with a simple yet powerful mission:
                  to create a hackathon that gives back to the community while
                  fostering innovation and collaboration among developers. We
                  believe that technology should be accessible to everyone, and
                  that the best solutions come from diverse teams working
                  together.
                </p>
                <p>
                  Our event is designed to be inclusive, educational, and fun.
                  Whether you&apos;re a beginner taking your first steps in
                  coding or an experienced developer looking to build something
                  amazing, there&apos;s a place for you at Godawari Hacks.
                </p>
              </>
            )}
          </div>
        </SplitHeading>
      </GridSection>

      <FeaturedIn title={about?.featuredTitle} items={press} />

      <GridSection id="expect" innerClassName="px-5 pb-16 pt-16">
        <SplitHeading title={about?.expectationsTitle || "What to Expect"}>
          <CheckList items={expectations} />
        </SplitHeading>
      </GridSection>

      {foundingTeam.length > 0 && (
        <GridSection id="team">
          <Team
            layout="split"
            title={
              about?.foundingTeamTitle ||
              "Meet our founding team of Godawari Hacks"
            }
            description={
              about?.foundingTeamDescription ||
              "The students who brought Godawari Hacks to life through community, creativity, and collaboration."
            }
            members={foundingTeam}
          />
        </GridSection>
      )}

      {/* Grey band with dashed rails, like dub's "Life at Dub". */}
      <section className="relative w-full overflow-hidden bg-neutral-50 px-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 inset-y-0 mx-auto max-w-grid-width border-x border-dashed border-grid-border"
        />
        <div className="relative mx-auto max-w-grid-width px-5 pb-14 pt-20 sm:pb-20 sm:pt-[104px]">
          <SplitHeading
            title={
              about?.bannerTitle || "Join Us for an Unforgettable Experience"
            }
          >
            <p>
              {about?.bannerDescription ||
                "Be part of a community that's passionate about technology, innovation, and making a difference."}
            </p>
          </SplitHeading>
          <RoundedPhoto
            photo={{ ...banner, alt: banner.alt || "Godawari Hacks Event" }}
            sizes="(max-width: 1080px) 100vw, 1040px"
            className="mt-10 aspect-[2/1] sm:mt-16"
          />
        </div>
      </section>
    </GridPageLayout>
  );
}

type Photo = { src: string; alt: string; blur?: string };

/** Sanity image when the field is filled, otherwise a local fallback photo. */
function photoFrom(
  image: SanityImage | undefined,
  fallback: string,
  width: number,
): Photo {
  if (!image?.asset) return { src: fallback, alt: "" };
  return {
    src: urlFor(image).width(width).auto("format").quality(80).url(),
    alt: image.alt || "",
    blur: image.asset.metadata?.lqip,
  };
}

function RoundedPhoto({
  photo,
  sizes,
  priority,
  className,
}: {
  photo: Photo;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-neutral-100",
        className,
      )}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
        {...(photo.blur
          ? { placeholder: "blur" as const, blurDataURL: photo.blur }
          : {})}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/5" />
    </div>
  );
}

function FlagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 2.75a.75.75 0 0 1 .75.75v.6l1.9-.5a8.4 8.4 0 0 1 5.17.33 6.9 6.9 0 0 0 4.27.28l1.48-.37a.75.75 0 0 1 .93.73v9.16a.75.75 0 0 1-.57.73l-1.48.37a8.4 8.4 0 0 1-5.19-.34 6.9 6.9 0 0 0-4.25-.27l-2.26.6v6.48a.75.75 0 0 1-1.5 0V3.5A.75.75 0 0 1 5 2.75Z" />
    </svg>
  );
}
