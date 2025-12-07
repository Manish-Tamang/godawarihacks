"use client";

import Image from "next/image";
import { GridWrapper } from "./GridWrapper";
import { generateBlurDataURL } from "../lib/utils";

const blurDataURL = generateBlurDataURL();

export function PhotoGrid() {
    return (
        <GridWrapper className="w-full max-w-[880px] h-[550px] mx-auto px-4 md:px-0">
            <div className="grid grid-cols-3 grid-rows-3 gap-[2px] w-full h-full">
                <div className="col-span-2 row-span-2 relative overflow-hidden">
                    <Image
                        src="/hackathon/team-godawari.jpg"
                        alt="Group photo of Team Godawari"
                        fill
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                        loading="lazy"
                        className="object-cover transition-opacity duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    />
                </div>

                <div className="col-span-1 row-span-1 relative overflow-hidden">
                    <Image
                        src="/hackathon/team-sushma.jpg"
                        alt="Team Sushma"
                        fill
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                        loading="lazy"
                        className="object-cover transition-opacity duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                </div>

                <div className="col-span-1 row-span-1 relative overflow-hidden">
                    <Image
                        src="/hackathon/sushma-3.jpg"
                        alt="Team collaboration"
                        fill
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                        loading="lazy"
                        className="object-cover transition-opacity duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                </div>

                <div className="col-span-1 row-span-1 relative overflow-hidden">
                    <Image
                        src="/hackathon/sushma-4.jpg"
                        alt="Event attendees"
                        fill
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                        loading="lazy"
                        className="object-cover transition-opacity duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                </div>

                <div className="col-span-1 row-span-1 relative overflow-hidden">
                    <Image
                        src="/hackathon/sushma-5.jpg"
                        alt="Workshop session"
                        fill
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                        loading="lazy"
                        className="object-cover transition-opacity duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                </div>

                <div className="col-span-1 row-span-1 relative overflow-hidden">
                    <Image
                        src="/hackathon/sushma-6.jpg"
                        alt="Technical presentation"
                        fill
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                        loading="lazy"
                        className="object-cover transition-opacity duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                </div>
            </div>
        </GridWrapper>
    );
}

