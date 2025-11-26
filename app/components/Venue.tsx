"use client";

import { GridWrapper } from "./GridWrapper";
import Image from "next/image";

export function Venue() {
    return (
        <GridWrapper className="before:hidden">
            <div className="relative py-8 -mt-16">
                <div className="relative w-full h-[600px] md:h-[700px] rounded-square overflow-hidden">
                    <Image
                        src="/hall.jpg"
                        alt="Conference Venue"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800/70 via-40% to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
                        <div className="space-y-8">
                            <div className="">
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-200">
                                    Hackathon Venue
                                </h2>
                                <p className="text-sm md:text-base text-gray-400 max-w-2xl">
                                    Everything you need to know to make it to the Hackathon.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                                <div className="space-y-3">
                                    <h3 className="text-base font-semibold text-gray-300 uppercase tracking-wide">
                                        Venue
                                    </h3>
                                    <div className="space-y-1 text-gray-200">
                                        <p className="font-bold text-md">Sushma Godawari College, Hall</p>
                                        <p className="font-bold text-md">Itahari-6, Sunsari</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-base font-semibold text-gray-300 uppercase tracking-wide">
                                        Dates
                                    </h3>
                                    <p className="text-gray-200 text-lg">
                                        December 3, 2025 (Day 1)
                                        December 4, 2025 (Day 2)
                                        December 5, 2025 (Day 3)
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-base font-semibold text-gray-300 uppercase tracking-wide">
                                        Location
                                    </h3>
                                    <div className="space-y-1 text-gray-200">
                                        <p className="text-lg">M73G+JXP, Mahendra Hwy, Itahari 56705</p>
                                        <p className="text-lg">Near Itahari Stadium</p>
                                        <a
                                            href="https://maps.app.goo.gl/6RicTp22CKCjbUZ29"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 underline hover:text-blue-300 transition-colors inline-block mt-2"
                                        >
                                            Click here to open in Google Maps
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GridWrapper>
    );
}

