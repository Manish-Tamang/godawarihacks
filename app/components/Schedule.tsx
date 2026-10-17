"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { GridWrapper } from "./GridWrapper";
import { generateBlurDataURL } from "../lib/utils";
import { Timeline } from "./Timeline";
import { urlFor } from "@/sanity/lib/image";
import { PortableTextContent } from "./PortableTextContent";
import type { RichTextValue } from "@/sanity/lib/portable-text";

interface ScheduleEventData {
    _id: string;
    day: string;
    time: string;
    title: string;
    description?: RichTextValue;
    location?: string;
    image?: { asset?: { _id: string; url: string; metadata?: { lqip?: string } }; alt?: string } | null;
}

const blurDataURL = generateBlurDataURL();

export function Schedule({ events }: { events?: ScheduleEventData[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const schedule = events ?? [];

    return (
        <div className="space-y-4 -mt-8 overflow-hidden">
            <h2 className="max-w-lg ml-4 -mb-2 text-balance text-left text-3xl font-medium leading-10 tracking-tight text-[#084750] md:text-4xl">
                Schedule
            </h2>
            <p className="text-left text-text-secondary max-w-2xl mb-8 ml-4">
                Here&apos;s what to expect during the 24-hour hackathon. Mark your calendars!
            </p>
            <GridWrapper>
                <div className="relative max-w-6xl mx-auto px-2 md:px-4 py-4">
                    <div ref={containerRef} className="relative">
                        <div className="space-y-8 md:space-y-8">
                            {schedule.map((event, index) => {
                                const isEven = index % 2 === 0;
                                const imageSrc = event.image?.asset ? urlFor(event.image).width(800).height(600).url() : blurDataURL;
                                const imageBlur = event.image?.asset?.metadata?.lqip || blurDataURL;
                                return (
                                    <motion.div
                                        key={event._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            ease: "easeOut",
                                            delay: index * 0.1,
                                        }}
                                        className="relative"
                                    >
                                        <div className="md:hidden space-y-3 bg-bg-primary dark:bg-neutral-900 rounded-square border border-border-primary p-4">
                                            <div className="flex items-center gap-2 text-sm mb-2">
                                                <span className="font-medium text-[#084750]">{event.day}</span>
                                                <span className="text-text-tertiary">•</span>
                                                <span className="text-text-tertiary">{event.time}</span>
                                            </div>
                                            {event.image?.asset && (
                                                <div className="relative w-full h-48 rounded-square overflow-hidden mb-3">
                                                    <Image
                                                        src={imageSrc}
                                                        alt={event.image.alt || event.title}
                                                        fill
                                                        placeholder="blur"
                                                        blurDataURL={imageBlur}
                                                        loading="lazy"
                                                        className="object-cover"
                                                        sizes="100vw"
                                                    />
                                                </div>
                                            )}
                                            <h3 className="text-xl font-semibold text-text-primary">
                                                {event.title}
                                            </h3>
                                            {event.description && (
                                                <div className="text-text-secondary leading-relaxed text-sm">
                                                    <PortableTextContent value={event.description} />
                                                </div>
                                            )}
                                            {event.location && (
                                                <p className="text-sm text-text-tertiary flex items-center gap-2">
                                                    <span>📍</span>
                                                    <span>{event.location}</span>
                                                </p>
                                            )}
                                        </div>

                                        <div className="hidden md:flex flex-row gap-4 items-center relative">
                                            <div
                                                className={`flex-1 ${isEven ? "pr-4 text-right" : "pl-4 text-left"} max-w-[calc(50%-1rem)]`}
                                            >
                                                {isEven ? (
                                                    event.image?.asset ? (
                                                        <div className="relative w-full h-96 rounded-square overflow-hidden">
                                                            <Image
                                                                src={imageSrc}
                                                                alt={event.image.alt || event.title}
                                                                fill
                                                                placeholder="blur"
                                                                blurDataURL={imageBlur}
                                                                loading="lazy"
                                                                className="object-cover transition-transform duration-300 hover:scale-105"
                                                                sizes="calc(50% - 1rem)"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-96 rounded-square bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                                                            <span className="text-text-tertiary">No image</span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3 justify-start">
                                                            <span className="text-sm font-medium text-[#084750]">{event.day}</span>
                                                            <span className="text-sm text-text-tertiary">•</span>
                                                            <span className="text-sm text-text-tertiary">{event.time}</span>
                                                        </div>
                                                        <h3 className="text-2xl font-semibold text-text-primary">{event.title}</h3>
                                                        {event.description && (
                                                            <div className="text-text-secondary leading-relaxed"><PortableTextContent value={event.description} /></div>
                                                        )}
                                                        {event.location && (
                                                            <p className="text-sm text-text-tertiary flex items-center gap-2">
                                                                <span>📍</span>
                                                                <span>{event.location}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-center w-8 h-8 flex-shrink-0 z-10"></div>

                                            <div
                                                className={`flex-1 ${isEven ? "pl-4 text-left" : "pr-4 text-right"} max-w-[calc(50%-1rem)]`}
                                            >
                                                {isEven ? (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3 justify-start">
                                                            <span className="text-sm font-medium text-[#084750]">{event.day}</span>
                                                            <span className="text-sm text-text-tertiary">•</span>
                                                            <span className="text-sm text-text-tertiary">{event.time}</span>
                                                        </div>
                                                        <h3 className="text-2xl font-semibold text-text-primary">{event.title}</h3>
                                                        {event.description && (
                                                            <div className="text-text-secondary leading-relaxed"><PortableTextContent value={event.description} /></div>
                                                        )}
                                                        {event.location && (
                                                            <p className="text-sm text-text-tertiary flex items-center gap-2">
                                                                <span>📍</span>
                                                                <span>{event.location}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    event.image?.asset ? (
                                                        <div className="relative w-full h-96 rounded-square overflow-hidden">
                                                            <Image
                                                                src={imageSrc}
                                                                alt={event.image.alt || event.title}
                                                                fill
                                                                placeholder="blur"
                                                                blurDataURL={imageBlur}
                                                                loading="lazy"
                                                                className="object-cover transition-transform duration-300 hover:scale-105"
                                                                sizes="calc(50% - 1rem)"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-96 rounded-square bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                                                            <span className="text-text-tertiary">No image</span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                        <div className="hidden md:block absolute top-0 h-[5200px] left-1/2 -translate-x-1/2 w-8 pointer-events-none">
                            <Timeline logoUrl="/sushma-logo.jpg" />
                        </div>
                    </div>
                </div>
            </GridWrapper>
        </div>
    );
}
