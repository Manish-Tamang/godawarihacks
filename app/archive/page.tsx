import type { Metadata } from "next";
import { MainSiteLayout } from "../components/MainSiteLayout";
import { GridWrapper } from "../components/GridWrapper";
import { ArchiveGallery, type ArchivePhoto } from "../components/ArchiveGallery";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ARCHIVE_PHOTOS_QUERY } from "@/sanity/lib/queries";
import type { ImageGallery, WithContext } from "schema-dts";

const SEASON = "2026";
const SITE_URL = "https://hack.godawari.edu.np";

export const metadata: Metadata = {
  title: "Archive",
  alternates: { canonical: "/archive" },
  description:
    "Photos from Godawari Hacks — the teams, the judging, the ceremony and everything in between.",
};

export default async function ArchivePage() {
  const photos = await sanityFetch<ArchivePhoto[]>({
    query: ARCHIVE_PHOTOS_QUERY,
    params: { season: SEASON },
    tags: ["archivePhoto"],
  });

  const jsonLd: WithContext<ImageGallery> = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `Godawari Hacks ${SEASON} Photo Archive`,
    description: `Photo archive from Godawari Hacks ${SEASON} at Sushma Godawari College, Itahari, Nepal.`,
    url: `${SITE_URL}/archive`,
    image: photos
      .filter((photo) => photo.image?.asset?.url)
      .map((photo) => ({
        "@type": "ImageObject" as const,
        contentUrl: photo.image!.asset!.url,
        caption: photo.caption || photo.alt,
        description: photo.alt,
      })),
  };

  return (
    <MainSiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mt-6 space-y-10 md:mt-0 md:space-y-16 pb-0">
        <section className="relative py-12 md:py-16">
          <div className="relative text-balance">
            <h1 className="mx-auto max-w-2xl text-center text-5xl font-bold leading-tight tracking-tighter text-[#084750] md:text-7xl md:leading-[78px]">
              Archive
            </h1>
            <div className="mt-4 text-center">
              <p className="mx-auto max-w-3xl text-base text-text-secondary md:text-lg">
                Every photo from Godawari Hacks {SEASON} — the teams, the
                judging, the ceremony and everything in between.
              </p>
              {photos.length > 0 && (
                <p className="mt-3 font-mono text-xs tabular-nums text-text-tertiary">
                  {photos.length} photos · {SEASON}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="relative">
          <GridWrapper>
            {photos.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-lg text-text-secondary">
                  No photos yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="p-2 md:p-4">
                <ArchiveGallery photos={photos} />
              </div>
            )}
          </GridWrapper>
        </section>
      </section>
    </MainSiteLayout>
  );
}
