import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { GridSection } from "./ui/grid-section";
import { SectionHeading } from "./ui/section-heading";
import { CellGrid } from "./ui/cell-grid";
import { PortableTextContent } from "./PortableTextContent";
import type { RichTextValue } from "@/sanity/lib/portable-text";

interface PrizeData {
  _key: string;
  title: string;
  amount?: string;
  description?: string;
  icon?: { asset?: { _id: string; url: string } } | null;
  gradientFrom?: string;
  gradientTo?: string;
  gradient?: string;
  image?: string;
}

interface PrizePoolProps {
  title?: string;
  description?: RichTextValue;
  prizes?: PrizeData[];
}

const DEFAULT_PRIZES: PrizeData[] = [
  {
    _key: "winner",
    title: "Winner",
    amount: "रु. 60,000 Worth",
    gradient: "bg-gradient-to-t from-[#F7DF1E] to-[#FFF394]",
    image: "/icons/1st.png",
  },
  {
    _key: "second",
    title: "Second",
    amount: "रु. 30,000 Worth",
    gradient: "bg-gradient-to-t from-[#F8981D] to-[#FFD39B]",
    image: "/icons/2nd.png",
  },
  {
    _key: "third",
    title: "Third",
    amount: "रु. 10,000 Worth",
    gradient: "bg-gradient-to-t from-blue-500 to-blue-300",
    image: "/icons/3rd.png",
  },
  {
    _key: "participants",
    title: "All Participants",
    description: "Exciting Prizes & Gift Hampers",
    gradient: "bg-gradient-to-t from-[#7852FA] to-[#BDAAFF]",
    image: "/icons/stickers.png",
  },
];

export function PrizePool({ title, description, prizes }: PrizePoolProps) {
  const items = prizes && prizes.length > 0 ? prizes : DEFAULT_PRIZES;

  return (
    <GridSection innerClassName="pt-10 sm:pt-20">
      <SectionHeading
        className="px-4 sm:px-10"
        title={title || "Prizes & Rewards"}
        description={
          description ? (
            <PortableTextContent value={description} />
          ) : (
            <p>
              Compete for exciting prizes worth over NRs. 1,00,000 and amazing
              gift hampers
            </p>
          )
        }
      />

      <div className="mt-10 border-t border-grid-border bg-neutral-50 sm:mt-20">
        <CellGrid className="grid-cols-2 lg:grid-cols-4">
          {items.map((prize) => {
            const gradient =
              prize.gradientFrom && prize.gradientTo
                ? `linear-gradient(to top, ${prize.gradientFrom}, ${prize.gradientTo})`
                : undefined;
            const iconSrc = prize.icon?.asset
              ? urlFor(prize.icon).width(200).height(200).url()
              : prize.image;

            return (
              <div
                key={prize._key}
                className="flex select-none flex-col items-center px-4 py-10 text-center"
              >
                <div
                  className={`flex size-24 items-center justify-center rounded-2xl border border-black/5 p-3 shadow-sm ${prize.gradient ?? ""}`}
                  style={gradient ? { background: gradient } : {}}
                >
                  {iconSrc ? (
                    <Image
                      src={iconSrc}
                      alt={prize.title}
                      width={100}
                      height={100}
                      className="object-contain drop-shadow-md"
                      draggable={false}
                    />
                  ) : null}
                </div>
                <p className="mt-6 font-medium text-neutral-900">
                  {prize.title}
                </p>
                <p className="mt-1.5 font-mono text-sm text-neutral-500">
                  {prize.amount ?? prize.description}
                </p>
              </div>
            );
          })}
        </CellGrid>
      </div>
    </GridSection>
  );
}
