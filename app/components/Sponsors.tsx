import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { GridSection } from "./ui/grid-section";
import { SectionHeading } from "./ui/section-heading";
import { CellGrid } from "./ui/cell-grid";
import { Button } from "./ui/button";
import { ArrowUpRightIcon } from "./icons/ui-icons";

interface SponsorData {
  _id: string;
  name: string;
  logo?: { asset?: { _id: string; url: string }; alt?: string } | null;
  url?: string;
  tier?: string;
}

const TIERS = [
  {
    id: "platinum",
    grid: "grid-cols-1",
    cell: "h-40 md:h-56",
    image: "h-20 max-w-[70%] md:h-32",
  },
  {
    id: "gold",
    grid: "grid-cols-2",
    cell: "h-36 md:h-48",
    image: "h-16 max-w-[78%] md:h-24",
  },
  {
    id: "silver",
    grid: "grid-cols-2 md:grid-cols-3",
    cell: "h-28 md:h-40",
    image: "h-14 max-w-[78%] md:h-20",
  },
  {
    id: "bronze",
    grid: "grid-cols-2 md:grid-cols-4",
    cell: "h-24 md:h-32",
    image: "h-12 max-w-[78%] md:h-16",
  },
] as const;

const FILL_ORDER = [
  "platinum",
  "gold",
  "gold",
  "silver",
  "silver",
  "silver",
] as const;

function groupSponsors(items: SponsorData[]) {
  const groups: Record<(typeof TIERS)[number]["id"], SponsorData[]> = {
    platinum: [],
    gold: [],
    silver: [],
    bronze: [],
  };

  const unranked: SponsorData[] = [];

  for (const sponsor of items) {
    const value = sponsor.tier?.toLowerCase();
    if (value === "platinum" || value === "title")
      groups.platinum.push(sponsor);
    else if (value === "gold") groups.gold.push(sponsor);
    else if (value === "silver") groups.silver.push(sponsor);
    else if (value === "bronze") groups.bronze.push(sponsor);
    else unranked.push(sponsor);
  }

  unranked.forEach((sponsor, index) => {
    groups[FILL_ORDER[index] ?? "bronze"].push(sponsor);
  });

  return groups;
}

function SponsorCell({
  sponsor,
  cell,
  image,
}: {
  sponsor: SponsorData;
  cell: string;
  image: string;
}) {
  const logo = sponsor.logo?.asset ? (
    <Image
      src={urlFor(sponsor.logo).width(800).height(400).url()}
      alt={sponsor.logo.alt || sponsor.name}
      width={800}
      height={400}
      className={`w-auto object-contain ${image}`}
    />
  ) : (
    <div className="px-4 text-center text-lg font-semibold text-neutral-900">
      {sponsor.name}
    </div>
  );

  const className = `group relative flex items-center justify-center bg-white px-6 ${cell}`;

  if (!sponsor.url) {
    return <div className={className}>{logo}</div>;
  }

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {logo}
      {/* Reveal-on-hover link chip, as on dub's customer grid. */}
      <span className="absolute right-4 top-4 flex translate-y-1 items-center rounded-full border border-neutral-300 bg-white p-1.5 text-neutral-500 opacity-0 ring ring-black/5 transition-[opacity,transform] group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowUpRightIcon className="size-3" strokeWidth={2.5} />
      </span>
    </a>
  );
}

export function Sponsors({ sponsors }: { sponsors?: SponsorData[] }) {
  const grouped = groupSponsors(sponsors ?? []);
  const rows = TIERS.map((tier) => ({
    ...tier,
    sponsors: grouped[tier.id],
  })).filter((row) => row.sponsors.length > 0);

  return (
    <GridSection id="sponsors" innerClassName="pt-20">
      <SectionHeading
        align="center"
        className="px-4"
        title="Our Sponsors"
        description={
          <p>
            We wouldn&apos;t be able to do what we do without the support of our
            generous sponsors.
          </p>
        }
      />
      <div className="mt-12 divide-y divide-grid-border border-y border-grid-border">
        {rows.map((row) => (
          <CellGrid key={row.id} className={row.grid}>
            {row.sponsors.map((sponsor) => (
              <SponsorCell
                key={sponsor._id}
                sponsor={sponsor}
                cell={row.cell}
                image={row.image}
              />
            ))}
          </CellGrid>
        ))}
      </div>
      <div className="flex flex-col items-center gap-4 px-4 py-12 text-center">
        <p className="text-neutral-500">
          Interested in sponsoring? We&apos;d love to hear from you!
        </p>
        <Button href="/contact" variant="secondary">
          Sponsor / Contact Us
        </Button>
      </div>
    </GridSection>
  );
}
