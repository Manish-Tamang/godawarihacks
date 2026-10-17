"use client";

import Image from "next/image";
import { GridWrapper } from "./GridWrapper";
import { urlFor } from "@/sanity/lib/image";

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

const FILL_ORDER = ["platinum", "gold", "gold", "silver", "silver", "silver"] as const;

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
    if (value === "platinum" || value === "title") groups.platinum.push(sponsor);
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
    <div className="px-4 text-center text-lg font-semibold text-text-primary">{sponsor.name}</div>
  );

  const className = `flex items-center justify-center border border-border-primary px-6 transition-shadow hover:shadow-md ${cell}`;

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
    <div className="space-y-4 -mt-8">
      <h2 className="max-w-lg ml-4 -mb-2 text-balance text-left text-3xl font-medium leading-10 tracking-tight text-[#084750] md:text-4xl">
        Our Sponsors
      </h2>
      <p className="text-left text-text-secondary max-w-2xl mb-8 ml-4">
        We wouldn&apos;t be able to do what we do without the support of our generous sponsors.
      </p>
      <GridWrapper>
        <div>
          {rows.map((row) => (
            <div key={row.id} className={`grid ${row.grid}`}>
              {row.sponsors.map((sponsor) => (
                <SponsorCell
                  key={sponsor._id}
                  sponsor={sponsor}
                  cell={row.cell}
                  image={row.image}
                />
              ))}
            </div>
          ))}
        </div>
      </GridWrapper>
      <div className="text-center pt-2">
        <p className="text-text-secondary mb-2">
          Interested in sponsoring? We&apos;d love to hear from you!
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-[#084750] text-white font-semibold rounded-square hover:bg-[#084750]/80 transition-colors"
        >
          Sponsor / Contact Us
        </a>
      </div>
    </div>
  );
}
