"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { GridWrapper } from "./GridWrapper";
import { AnimatedText } from "./AnimatedText";
import { generateBlurDataURL } from "../lib/utils";
import { Timeline } from "./Timeline";

interface ScheduleEvent {
    day: string;
    time: string;
    title: string;
    description: string;
    location?: string;
    image: string;
}

const blurDataURL = generateBlurDataURL();

const schedule: ScheduleEvent[] = [
    {
        day: "Day 1",
        time: "9:00 AM – 10:00 AM",
        title: "Arriving Time",
        description: "Participants arrive and check in. Get settled and ready for an amazing hackathon experience!",
        image: "/arrival.jpg",
    },
    {
        day: "Day 1",
        time: "10:00 AM – 11:00 AM",
        title: "Introduction AND SNACKS",
        description: "Welcome session with introductions, hackathon rules, and enjoy some snacks to fuel up!",
        image: "/snacks.jpg",
    },
    {
        day: "Day 1",
        time: "10:30 AM – 10:50 AM",
        title: "SNACKS",
        description: "Quick snack break to keep your energy levels up before the coding begins!",
        image: "/hackathon/sushma-3.jpg",
    },
    {
        day: "Day 1",
        time: "11:00 AM",
        title: "Hackathon Start",
        description: "The coding marathon begins! Start building your project and let the innovation flow.",
        image: "/hackathon/sushma-4.jpg",
    },
    {
        day: "Day 1",
        time: "4:00 PM",
        title: "SNACKS",
        description: "Afternoon snack break to refuel and recharge for the evening coding session.",
        image: "/hackathon/sushma-5.jpg",
    },
    {
        day: "Day 1",
        time: "8:00 PM",
        title: "FOOD",
        description: "Dinner time! Enjoy a delicious meal to keep you going through the night.",
        image: "/hackathon/sushma-6.jpg",
    },
    {
        day: "Day 1",
        time: "10:00 PM – 5:00 AM",
        title: "2 TIME COFFEE",
        description: "Late night coding session with coffee breaks at 10 PM and 5 AM to keep you energized through the night!",
        image: "/hackathon/sushm-1.jpg",
    },
    {
        day: "Day 1",
        time: "11:00 PM – 4:00 AM",
        title: "CHATGPT GIVEAWAY AND QUIZ HUNTING ROUND",
        description: "Exciting ChatGPT giveaway and quiz hunting round! Test your knowledge and win prizes while you code.",
        image: "/hackathon/sushma-2.jpg",
    },
    {
        day: "Day 2",
        time: "9:00 AM",
        title: "FOOD",
        description: "Breakfast time! Start your second day with a hearty meal to power through the final hours.",
        image: "/hackathon/sushma-3.jpg",
    },
    {
        day: "Day 2",
        time: "11:00 AM",
        title: "Project Submission Ended",
        description: "Time's up! All project submissions must be completed by this time. Make sure everything is submitted!",
        image: "/hackathon/sushma-4.jpg",
    },
    {
        day: "Day 2",
        time: "11:00 AM – 4:00 PM",
        title: "PRESENTATION",
        description: "Teams present their projects to the judges. Show off what you've built in the last 24 hours!",
        image: "/hackathon/sushma-5.jpg",
    },
    {
        day: "Day 2",
        time: "4:00 PM",
        title: "SNACKS",
        description: "Final snack break while waiting for the results and winner announcements.",
        image: "/hackathon/sushma-6.jpg",
    },
    {
        day: "Day 2",
        time: "4:30 PM – 5:30 PM",
        title: "Winner and Price Distribution",
        description: "The moment we've all been waiting for! Winners are announced and prizes are distributed. Celebrate the amazing work!",
        image: "/prize.jpg",
    },
];

export function Schedule() {
    const containerRef = useRef<HTMLDivElement>(null);

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
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            ease: "easeOut",
                                            delay: index * 0.1,
                                        }}
                                        className="relative"
                                    >
                                        {/* Mobile Layout - Vertical Card */}
                                        <div className="md:hidden space-y-3 bg-bg-primary dark:bg-neutral-900 rounded-square border border-border-primary p-4">
                                            <div className="flex items-center gap-2 text-sm mb-2">
                                                <span className="font-medium text-[#084750]">{event.day}</span>
                                                <span className="text-text-tertiary">•</span>
                                                <span className="text-text-tertiary">{event.time}</span>
                                            </div>

                                            <div className="relative w-full h-48 rounded-square overflow-hidden mb-3">
                                                <Image
                                                    src={event.image}
                                                    alt={event.title}
                                                    fill
                                                    placeholder="blur"
                                                    blurDataURL={blurDataURL}
                                                    loading="lazy"
                                                    className="object-cover"
                                                    sizes="100vw"
                                                />
                                            </div>

                                            <h3 className="text-xl font-semibold text-text-primary">
                                                {event.title}
                                            </h3>
                                            <p className="text-text-secondary leading-relaxed text-sm">
                                                {event.description}
                                            </p>
                                            {event.location && (
                                                <p className="text-sm text-text-tertiary flex items-center gap-2">
                                                    <span>📍</span>
                                                    <span>{event.location}</span>
                                                </p>
                                            )}
                                        </div>

                                        {/* Desktop Layout - Timeline Layout */}
                                        <div className="hidden md:flex flex-row gap-4 items-center relative">
                                            <div
                                                className={`flex-1 ${isEven ? "pr-4 text-right" : "pl-4 text-left"} max-w-[calc(50%-1rem)]`}
                                            >
                                                {isEven ? (
                                                    <div className="relative w-full h-96 rounded-square overflow-hidden">
                                                        <Image
                                                            src={event.image}
                                                            alt={event.title}
                                                            fill
                                                            placeholder="blur"
                                                            blurDataURL={blurDataURL}
                                                            loading="lazy"
                                                            className="object-cover transition-transform duration-300 hover:scale-105"
                                                            sizes="calc(50% - 1rem)"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3 justify-start">
                                                            <span className="text-sm font-medium text-[#084750]">
                                                                {event.day}
                                                            </span>
                                                            <span className="text-sm text-text-tertiary">•</span>
                                                            <span className="text-sm text-text-tertiary">{event.time}</span>
                                                        </div>
                                                        <h3 className="text-2xl font-semibold text-text-primary">
                                                            {event.title}
                                                        </h3>
                                                        <p className="text-text-secondary leading-relaxed">
                                                            {event.description}
                                                        </p>
                                                        {event.location && (
                                                            <p className="text-sm text-text-tertiary flex items-center gap-2">
                                                                <span>📍</span>
                                                                <span>{event.location}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-center w-8 h-8 flex-shrink-0 z-10">
                                            </div>

                                            <div
                                                className={`flex-1 ${isEven ? "pl-4 text-left" : "pr-4 text-right"} max-w-[calc(50%-1rem)]`}
                                            >
                                                {isEven ? (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3 justify-start">
                                                            <span className="text-sm font-medium text-[#084750]">
                                                                {event.day}
                                                            </span>
                                                            <span className="text-sm text-text-tertiary">•</span>
                                                            <span className="text-sm text-text-tertiary">{event.time}</span>
                                                        </div>
                                                        <h3 className="text-2xl font-semibold text-text-primary">
                                                            {event.title}
                                                        </h3>
                                                        <p className="text-text-secondary leading-relaxed">
                                                            {event.description}
                                                        </p>
                                                        {event.location && (
                                                            <p className="text-sm text-text-tertiary flex items-center gap-2">
                                                                <span>📍</span>
                                                                <span>{event.location}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="relative w-full h-96 rounded-square overflow-hidden">
                                                        <Image
                                                            src={event.image}
                                                            alt={event.title}
                                                            fill
                                                            placeholder="blur"
                                                            blurDataURL={blurDataURL}
                                                            loading="lazy"
                                                            className="object-cover transition-transform duration-300 hover:scale-105"
                                                            sizes="calc(50% - 1rem)"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                        {/* Timeline - Hidden on Mobile, Visible on Desktop */}
                        <div className="hidden md:block absolute top-0 h-[5200px] left-1/2 -translate-x-1/2 w-8 pointer-events-none">
                            <Timeline logoUrl="/sushma-logo.jpg" />
                        </div>
                    </div>
                </div>
            </GridWrapper>
        </div>
    );
}

