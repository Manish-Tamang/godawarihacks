import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { GridSection } from "./ui/grid-section";
import { SectionHeading } from "./ui/section-heading";
import { CalendarIcon, MapPinIcon } from "./icons/ui-icons";
import { generateBlurDataURL } from "../lib/utils";
import { cn } from "../lib/utils";
import { PortableTextContent } from "./PortableTextContent";
import type { RichTextValue } from "@/sanity/lib/portable-text";

interface ScheduleEventData {
  _id: string;
  day: string;
  time: string;
  title: string;
  description?: RichTextValue;
  location?: string;
  image?: {
    asset?: { _id: string; url: string; metadata?: { lqip?: string } };
    alt?: string;
  } | null;
}

const blurDataURL = generateBlurDataURL();

export function Schedule({ events }: { events?: ScheduleEventData[] }) {
  const schedule = events ?? [];

  return (
    <GridSection
      id="schedule"
      innerClassName="grid grid-cols-1 md:grid-cols-[2fr_3fr]"
    >
      <div className="px-4 py-14 md:px-10">
        <SectionHeading
          className="md:sticky md:top-28"
          title="Schedule"
          description={
            <p>
              Here&apos;s what to expect during the 24-hour hackathon. Mark your
              calendars!
            </p>
          }
        />
      </div>
      <ol className="border-grid-border max-md:border-t md:border-l">
        {schedule.map((event, index) => (
          <ScheduleItem
            key={event._id}
            event={event}
            isFirst={index === 0}
            isLast={index === schedule.length - 1}
          />
        ))}
      </ol>
    </GridSection>
  );
}

function ScheduleItem({
  event,
  isFirst,
  isLast,
}: {
  event: ScheduleEventData;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <li className="relative grid grid-cols-[min-content_minmax(0,1fr)] px-2">
      <div className="relative px-4 py-8 md:px-8 md:py-10">
        {/* Rail joining the date markers; it starts and stops at the outer ones. */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-px border-l border-neutral-200",
            isFirst ? "top-14 md:top-16" : "top-0",
            isLast ? "h-14 md:h-16" : "bottom-0",
            isFirst && isLast && "hidden",
          )}
        />
        <div className="relative flex size-12 items-center justify-center rounded-full border border-neutral-300 bg-white">
          <CalendarIcon className="size-4 text-neutral-600" strokeWidth={1.5} />
        </div>
      </div>
      <div className="py-8 pr-4 md:py-10 md:pr-8">
        <h3 className="pt-1 text-base font-medium text-neutral-900 md:text-lg">
          {event.title}
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          {event.day} <span className="text-neutral-300">•</span> {event.time}
        </p>
        {event.description && (
          <div className="mt-3 text-sm leading-relaxed text-neutral-500">
            <PortableTextContent value={event.description} />
          </div>
        )}
        {event.location && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-neutral-500">
            <MapPinIcon className="size-3.5 shrink-0" />
            {event.location}
          </p>
        )}
        {event.image?.asset && (
          <div className="relative mt-4 aspect-video overflow-hidden rounded-xl border border-neutral-200">
            <Image
              src={urlFor(event.image).width(800).height(450).url()}
              alt={event.image.alt || event.title}
              fill
              placeholder="blur"
              blurDataURL={event.image.asset.metadata?.lqip || blurDataURL}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 560px"
            />
          </div>
        )}
      </div>
    </li>
  );
}
