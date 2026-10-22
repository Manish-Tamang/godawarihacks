import type { Metadata } from "next";
import { GridPageLayout } from "../components/GridPageLayout";
import { GridSection } from "../components/ui/grid-section";
import { PageHero } from "../components/ui/page-hero";
import {
  ArchiveGallery,
  type ArchivePhoto,
} from "../components/ArchiveGallery";
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
    <GridPageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        title="Archive"
        description={
          <p>
            Every photo from Godawari Hacks {SEASON} — the teams, the judging,
            the ceremony and everything in between.
          </p>
        }
      >
        {photos.length > 0 && (
          <p className="mt-4 font-mono text-xs tabular-nums text-neutral-500">
            {photos.length} photos · {SEASON}
          </p>
        )}
      </PageHero>

      <GridSection innerClassName="bg-neutral-50">
        {photos.length === 0 ? (
          <p className="px-5 py-24 text-center text-lg text-neutral-500">
            No photos yet. Check back soon!
          </p>
        ) : (
          <div className="p-2 md:p-4">
            <ArchiveGallery photos={photos} />
          </div>
        )}
      </GridSection>
    </GridPageLayout>
  );
}
