import Image from "next/image";
import { GridWrapper } from "./GridWrapper";
import { generateBlurDataURL } from "../lib/utils";
import { urlFor } from "@/sanity/lib/image";

const blurDataURL = generateBlurDataURL();

const flexPattern = [
  "flex-[0.72]",
  "flex-[1.15]",
  "flex-[1.55]",
  "flex-[0.82]",
  "flex-[1.35]",
  "flex-[0.95]",
  "flex-[1.25]",
  "flex-[0.68]",
];

const rowOne = [
  { src: "/hackathon/sushm-1.jpg", alt: "Hackathon hall", flex: "flex-[0.72]" },
  { src: "/hackathon/sushma-2.jpg", alt: "Students presenting", flex: "flex-[1.15]" },
  { src: "/hackathon/team-godawari.jpg", alt: "Team Godawari", flex: "flex-[1.55]" },
  { src: "/hackathon/sushma-3.jpg", alt: "Teams collaborating", flex: "flex-[0.82]" },
  { src: "/hackathon/sushma-4.jpg", alt: "Group photo", flex: "flex-[1.35]" },
  { src: "/hackathon/team-sushma.jpg", alt: "Team Sushma", flex: "flex-[0.95]" },
  { src: "/arrival.jpg", alt: "Arrival", flex: "flex-[1.25]" },
  { src: "/hall.jpg", alt: "Venue hall", flex: "flex-[0.68]" },
];

const rowTwo = [
  { src: "/hackathon/sushma-5.jpg", alt: "Workshop", flex: "flex-[1.2]" },
  { src: "/1st.jpg", alt: "Winners", flex: "flex-[0.7]" },
  { src: "/judges.jpg", alt: "Judges", flex: "flex-[1.45]" },
  { src: "/prize.jpg", alt: "Prize table", flex: "flex-[1.05]" },
  { src: "/snacks.jpg", alt: "Snacks", flex: "flex-[1.6]" },
  { src: "/swatika.jpg", alt: "Presentation", flex: "flex-[0.78]" },
  { src: "/sushma-leaders.jpg", alt: "Organizers", flex: "flex-[1.15]" },
  { src: "/hackathon/sushma-6.jpg", alt: "Closing moments", flex: "flex-[0.9]" },
];

type GalleryPhoto = {
  _key: string;
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  asset?: {
    _id: string;
    url: string;
    metadata?: { lqip?: string };
  };
};

type PhotoGallery = {
  title?: string;
  description?: string;
  photos?: GalleryPhoto[];
};

type RowPhoto = {
  key: string;
  src: string;
  alt: string;
  flex: string;
  blur?: string;
};

function PhotoRow({
  photos,
  className = "",
}: {
  photos: RowPhoto[];
  className?: string;
}) {
  if (photos.length === 0) return null;

  return (
    <div className={`flex gap-2 md:gap-2.5 ${className}`}>
      {photos.map((photo) => (
        <div
          key={photo.key}
          className={`relative h-[92px] min-w-0 overflow-hidden rounded-[4px] sm:h-[120px] md:h-[148px] ${photo.flex}`}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            placeholder="blur"
            blurDataURL={photo.blur || blurDataURL}
            className="object-cover"
            sizes="(max-width: 768px) 28vw, 220px"
          />
        </div>
      ))}
    </div>
  );
}

function galleryRows(photos: GalleryPhoto[]): [RowPhoto[], RowPhoto[]] | null {
  const ready = photos.flatMap((photo) => {
    if (!photo.asset) return [];
    return [
      {
        key: photo._key,
        src: urlFor(photo).width(900).height(560).fit("crop").auto("format").url(),
        alt: photo.alt || photo.caption || "Hackathon photo",
        blur: photo.asset.metadata?.lqip,
      },
    ];
  });

  if (ready.length === 0) return null;

  const mid = Math.ceil(ready.length / 2);
  const toRow = (items: Omit<RowPhoto, "flex">[], offset: number): RowPhoto[] =>
    items.map((photo, index) => ({
      ...photo,
      flex: flexPattern[(index + offset) % flexPattern.length],
    }));

  return [toRow(ready.slice(0, mid), 0), toRow(ready.slice(mid), 3)];
}

export function HackathonDiaries({ gallery }: { gallery?: PhotoGallery | null }) {
  const fromGallery = galleryRows(gallery?.photos ?? []);
  const first = fromGallery
    ? fromGallery[0]
    : rowOne.map((photo) => ({ ...photo, key: photo.src }));
  const second = fromGallery
    ? fromGallery[1]
    : rowTwo.map((photo) => ({ ...photo, key: photo.src }));

  return (
    <div className="space-y-4 -mt-8">
      <div className="space-y-3 px-4 md:px-6">
        <h2 className="text-balance text-left text-3xl font-medium leading-10 tracking-tight text-[#084750] md:text-4xl">
          {gallery?.title || "From the last hackathon"}
        </h2>
        <p className="max-w-2xl text-left leading-relaxed text-text-secondary">
          {gallery?.description ||
            "A look at the hall, the teams, and the 24 hours they spent building together."}
        </p>
      </div>
      <GridWrapper>
        <div
          className="flex flex-col gap-2 py-6 md:gap-2.5 md:py-8"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        >
          <PhotoRow photos={first} className="-mr-10" />
          <PhotoRow photos={second} className="-ml-8" />
        </div>
      </GridWrapper>
    </div>
  );
}
