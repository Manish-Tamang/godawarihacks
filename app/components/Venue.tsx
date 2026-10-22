import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { GridSection } from "./ui/grid-section";
import { SectionHeading } from "./ui/section-heading";
import { FeatureGrid, FeatureItem } from "./ui/feature-grid";
import {
  BuildingIcon,
  CalendarIcon,
  ChevronRightIcon,
  MapPinIcon,
} from "./icons/ui-icons";

interface VenueData {
  name: string;
  address?: string;
  city?: string;
  dates?: string;
  plusCode?: string;
  landmark?: string;
  mapUrl?: string;
  image?: {
    asset?: { _id: string; url: string; metadata?: { lqip?: string } };
    alt?: string;
  } | null;
}

export function Venue({ venue }: { venue?: VenueData | null }) {
  const imageSrc = venue?.image?.asset
    ? urlFor(venue.image).width(1400).height(800).url()
    : "/hall.jpg";

  return (
    <GridSection id="venue" innerClassName="pt-10 sm:pt-20">
      <SectionHeading
        className="px-4 sm:px-10"
        title="Hackathon Venue"
        description={
          <p>Everything you need to know to make it to the Hackathon.</p>
        }
      />

      <div className="mt-10 border-t border-grid-border bg-neutral-50 px-4 sm:mt-20 sm:px-8">
        <div className="mx-auto max-w-[940px] pt-8 sm:pt-12">
          <div className="rounded-2xl border border-neutral-200 bg-white/50 p-2 shadow-sm">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-neutral-200 sm:aspect-[16/8]">
              <Image
                src={imageSrc}
                alt={venue?.image?.alt || "Conference Venue"}
                fill
                className="object-cover"
                sizes="(max-width: 940px) 100vw, 940px"
              />
            </div>
          </div>
        </div>

        <FeatureGrid className="mx-auto max-w-[800px] py-10">
          <FeatureItem icon={<BuildingIcon className="size-4" />} title="Venue">
            <p>{venue?.name || "Sushma Godawari College, Hall"}</p>
            <p>{venue?.address || "Itahari-6, Sunsari"}</p>
          </FeatureItem>
          <FeatureItem icon={<CalendarIcon className="size-4" />} title="Dates">
            <p>{venue?.dates || "18th - 19th January 2026"}</p>
          </FeatureItem>
          <FeatureItem
            icon={<MapPinIcon className="size-4" />}
            title="Location"
          >
            <p>{venue?.plusCode || "M73G+JXP, Mahendra Hwy, Itahari 56705"}</p>
            <p>{venue?.landmark || "Near Itahari Stadium"}</p>
            {venue?.mapUrl && (
              <a
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group !mt-3.5 block text-sm font-medium text-blue-600"
              >
                Click here to open in Google Maps
                <ChevronRightIcon className="ml-0.5 inline size-4 align-[-3px] transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </FeatureItem>
        </FeatureGrid>
      </div>
    </GridSection>
  );
}
