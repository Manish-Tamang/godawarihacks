import Image from "next/image";
import { GridSection } from "./ui/grid-section";
import { Notch } from "./ui/notch";
import { generateBlurDataURL } from "../lib/utils";

const blurDataURL = generateBlurDataURL();

const photos = [
  {
    src: "/1st.jpg",
    alt: "Group photo of Team Godawari",
    caption: "’26 Winner",
    className: "col-span-2 row-span-2",
    sizes: "(max-width: 940px) 66vw, 620px",
  },
  {
    src: "/2nd.jpg",
    alt: "Team Sushma",
    caption: "’26 Second",
    className: "col-span-1 row-span-1",
    sizes: "(max-width: 940px) 33vw, 310px",
  },
  {
    src: "/3rd.jpg",
    alt: "Team collaboration",
    caption: "’26 Third",
    className: "col-span-1 row-span-1",
    sizes: "(max-width: 940px) 33vw, 310px",
  },
  {
    src: "/judges.jpg",
    alt: "Event attendees",
    caption: "’26 Judges",
    className: "col-span-1 row-span-1",
    sizes: "(max-width: 940px) 33vw, 310px",
  },
  {
    src: "/IMG-20260119-WA0355.jpg",
    alt: "Workshop session",
    caption: "’26 Extra Games",
    className: "col-span-1 row-span-1",
    sizes: "(max-width: 940px) 33vw, 310px",
  },
  {
    src: "/swatika.jpg",
    alt: "Technical presentation",
    caption: "’26 Presentation",
    className: "col-span-1 row-span-1",
    sizes: "(max-width: 940px) 33vw, 310px",
  },
] as const;

/** Showcase band under the hero: last year's photos in a framed bento grid. */
export function PhotoGrid() {
  return (
    <GridSection className="bg-neutral-100">
      <Notch className="text-white" />
      <div className="mx-auto mt-6 max-w-[940px] px-4 pb-16 [perspective:1000px]">
        <div className="animate-slide-up-fade rounded-2xl border border-neutral-200 bg-white/50 p-2 shadow-sm [--offset:20px] [animation-delay:500ms] [animation-duration:400ms] [animation-fill-mode:both] motion-reduce:animate-fade-in">
          <div className="grid h-[360px] grid-cols-3 grid-rows-3 gap-2 md:h-[560px]">
            {photos.map((photo) => (
              <div
                key={photo.src}
                className={`relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 ${photo.className}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  className="object-cover"
                  sizes={photo.sizes}
                />
                <span className="pointer-events-none absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-md border border-black/5 bg-white/90 px-1.5 py-0.5 font-mono text-[10px] font-medium text-neutral-700 backdrop-blur-sm">
                  {photo.caption}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Soft rainbow wash, as behind dub's product shot. */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 hidden h-3/4 w-[1600px] -translate-x-1/2 bg-[conic-gradient(from_-81deg,#F00,#EAB308_99deg,#5CFF80_162deg,#00FFF9_216deg,#3A8BFD_288deg,#855AFC)] opacity-[0.08] mix-blend-overlay blur-[200px] md:block" />
    </GridSection>
  );
}
