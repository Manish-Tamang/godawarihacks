"use client";

import Image from "next/image";
import { GridWrapper } from "./GridWrapper";
import { generateBlurDataURL } from "../lib/utils";

const blurDataURL = generateBlurDataURL();

const photos = [
    {
        src: "/1st.jpg",
        alt: "Group photo of Team Godawari",
        caption: "’26 Winner",
        className: "col-span-2 row-span-2",
        sizes: "(max-width: 1150px) 66vw, 766px",
    },
    {
        src: "/2nd.jpg",
        alt: "Team Sushma",
        caption: "’26 Second",
        className: "col-span-1 row-span-1",
        sizes: "(max-width: 1150px) 33vw, 382px",
    },
    {
        src: "/3rd.jpg",
        alt: "Team collaboration",
        caption: "’26 Third",
        className: "col-span-1 row-span-1",
        sizes: "(max-width: 1150px) 33vw, 382px",
    },
    {
        src: "/judges.jpg",
        alt: "Event attendees",
        caption: "’26 Judges",
        className: "col-span-1 row-span-1",
        sizes: "(max-width: 1150px) 33vw, 382px",
    },
    {
        src: "/IMG-20260119-WA0355.jpg",
        alt: "Workshop session",
        caption: "’26 Extra Games",
        className: "col-span-1 row-span-1",
        sizes: "(max-width: 1150px) 33vw, 382px",
    },
    {
        src: "/swatika.jpg",
        alt: "Technical presentation",
        caption: "’26 Presentation",
        className: "col-span-1 row-span-1",
        sizes: "(max-width: 1150px) 33vw, 382px",
    },
] as const;

export function PhotoGrid() {
    return (
        <GridWrapper className="w-full h-[420px] md:h-[640px]">
            <div className="grid grid-cols-3 grid-rows-3 gap-[2px] w-full h-full">
                {photos.map((photo) => (
                    <div
                        key={photo.src}
                        className={`relative overflow-hidden ${photo.className}`}
                    >
                        <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            placeholder="blur"
                            blurDataURL={blurDataURL}
                            loading="lazy"
                            className="object-cover transition-opacity duration-500"
                            sizes={photo.sizes}
                        />
                        <span
                            className="pointer-events-none absolute bottom-1.5 right-2 z-20 font-mono tabular-nums"
                            style={{
                                fontSize: "10px",
                                color: "rgb(255, 138, 61)",
                                textShadow: "rgba(255, 110, 40, 0.45) 0px 0px 6px",
                                letterSpacing: "0.04em",
                            }}
                        >
                            {photo.caption}
                        </span>
                    </div>
                ))}
            </div>
        </GridWrapper>
    );
}
