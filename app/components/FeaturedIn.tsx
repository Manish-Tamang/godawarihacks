import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { GridSection } from "./ui/grid-section";
import { SplitHeading } from "./ui/split-heading";
import { ArrowUpRightIcon } from "./icons/ui-icons";

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

export type PressMention = {
  _key: string;
  outlet: string;
  title: string;
  url: string;
  publishedAt?: string;
  image?: SanityImage;
};

function formatDate(date: string) {
  // Plain `YYYY-MM-DD` from Sanity; read it as UTC so it never shifts a day.
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** News coverage of the hackathon as linked article cards. */
export function FeaturedIn({
  title,
  items,
}: {
  title?: string | null;
  items: PressMention[];
}) {
  if (items.length === 0) return null;

  return (
    <GridSection id="featured" innerClassName="pt-16">
      <SplitHeading className="px-5" title={title || "We are featured in"} />
      <div className="mt-10 border-t border-grid-border bg-neutral-50 p-5 sm:mt-12 sm:p-8">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {items.map((item) => {
            const cover = item.image?.asset
              ? urlFor(item.image).width(1000).height(667).auto("format").url()
              : null;

            return (
              <li key={item._key}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {cover && (
                    <div className="relative aspect-[3/2] overflow-hidden border-b border-neutral-200 bg-neutral-100">
                      <Image
                        src={cover}
                        alt={item.image?.alt || ""}
                        fill
                        sizes="(max-width: 640px) 100vw, 500px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        {...(item.image?.asset?.metadata?.lqip
                          ? {
                              placeholder: "blur" as const,
                              blurDataURL: item.image.asset.metadata.lqip,
                            }
                          : {})}
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="font-medium text-neutral-800">
                        {item.outlet}
                      </span>
                      {item.publishedAt && (
                        <>
                          <span aria-hidden="true">·</span>
                          <time dateTime={item.publishedAt}>
                            {formatDate(item.publishedAt)}
                          </time>
                        </>
                      )}
                    </p>
                    <p
                      lang="ne"
                      className="text-pretty text-lg font-medium leading-snug text-neutral-900"
                    >
                      {item.title}
                    </p>
                    <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-brand">
                      Read article
                      <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </GridSection>
  );
}
