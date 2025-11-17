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
    day: "Day 1 - Dec 1",
    time: "9:00 AM",
    title: "Opening Ceremony & Team Formation",
    description: "Kick off the hackathon with an inspiring opening ceremony. Meet your fellow participants, form teams, and get ready for an amazing journey ahead.",
    image: "/hackathon/sushm-1.jpg",
  },
  {
    day: "Day 1 - Dec 1",
    time: "10:00 AM - 10:00 PM",
    title: "Hacking Begins!",
    description: "12 hours of intense coding, collaboration, and innovation. Build something amazing with your team!",
    image: "/hackathon/sushma-2.jpg",
  },
  {
    day: "Day 2 - Dec 2",
    time: "9:00 AM",
    title: "Morning Check-in & Mentorship",
    description: "Start your day with a check-in session and get guidance from our mentors. Refuel with coffee and snacks.",
    image: "/hackathon/sushma-3.jpg",
  },
  {
    day: "Day 2 - Dec 2",
    time: "10:00 AM - 10:00 PM",
    title: "Continue Building",
    description: "Keep the momentum going! Refine your project, fix bugs, and add those final touches.",
    image: "/hackathon/sushma-4.jpg",
  },
  {
    day: "Day 3 - Dec 3",
    time: "9:00 AM",
    title: "Final Push & Submission",
    description: "Last chance to polish your project! Submit your work before the deadline.",
    image: "/hackathon/sushma-5.jpg",
  },
  {
    day: "Day 3 - Dec 3",
    time: "2:00 PM",
    title: "Presentations & Judging",
    description: "Show off what you've built! Each team gets a chance to present their project to our panel of judges.",
    image: "/hackathon/sushma-6.jpg",
  },
  {
    day: "Day 3 - Dec 3",
    time: "5:00 PM",
    title: "Awards Ceremony & Closing",
    description: "Celebrate the winners and all participants! Join us for the closing ceremony and networking event.",
    image: "/hackathon/sushm-1.jpg",
  },
];

export function HackathonSchedule() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4 -mt-8">
      <h2 className="max-w-lg ml-4 -mb-2 text-balance text-left text-3xl font-medium leading-10 tracking-tight text-indigo-600 md:text-4xl">
        Schedule
      </h2>
      <p className="text-left text-text-secondary max-w-2xl mb-8 ml-4">
        Here&apos;s what to expect during the 3-day hackathon. Mark your calendars!
      </p>
      <GridWrapper>
        <div className="relative max-w-6xl mx-auto px-2 md:px-4 py-4">
          <div ref={containerRef} className="relative">


            <div className="space-y-8">
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
                    <div className="flex flex-col md:flex-row gap-6 md:gap-4 items-center relative">
                      <div
                        className={`flex-1 ${isEven ? "md:pr-4 md:text-right" : "md:pl-4 md:text-left"} md:max-w-[calc(50%-1rem)]`}
                      >
                        {isEven ? (
                          <div className="relative w-full h-64 md:h-96 rounded-square overflow-hidden">
                            <Image
                              src={event.image}
                              alt={event.title}
                              fill
                              placeholder="blur"
                              blurDataURL={blurDataURL}
                              loading="lazy"
                              className="object-cover transition-transform duration-300 hover:scale-105"
                              sizes="(max-width: 768px) 100vw, calc(50% - 1rem)"
                            />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="hidden md:flex items-center gap-3 justify-start">
                              <span className="text-sm font-medium text-blue-600">
                                {event.day}
                              </span>
                              <span className="text-sm text-text-tertiary">•</span>
                              <span className="text-sm text-text-tertiary">{event.time}</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-semibold text-text-primary">
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

                      <div className="hidden md:flex items-center justify-center w-8 h-8 flex-shrink-0 z-10">
                      </div>

                      <div className="md:hidden flex items-center gap-3 mb-2 w-full">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-blue-600">{event.day}</span>
                          <span className="text-text-tertiary">•</span>
                          <span className="text-text-tertiary">{event.time}</span>
                        </div>
                      </div>
                      <div
                        className={`flex-1 ${isEven ? "md:pl-4 md:text-left" : "md:pr-4 md:text-right"} md:max-w-[calc(50%-1rem)]`}
                      >
                        {isEven ? (
                          <div className="space-y-3">
                            <div className="hidden md:flex items-center gap-3 justify-start">
                              <span className="text-sm font-medium text-blue-600">
                                {event.day}
                              </span>
                              <span className="text-sm text-text-tertiary">•</span>
                              <span className="text-sm text-text-tertiary">{event.time}</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-semibold text-text-primary">
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
                          <div className="relative w-full h-64 md:h-96 rounded-square overflow-hidden">
                            <Image
                              src={event.image}
                              alt={event.title}
                              fill
                              placeholder="blur"
                              blurDataURL={blurDataURL}
                              loading="lazy"
                              className="object-cover transition-transform duration-300 hover:scale-105"
                              sizes="(max-width: 768px) 100vw, calc(50% - 1rem)"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className=" absolute top-0 h-[2500px] left-1/2 -translate-x-1/2 w-8 pointer-events-none">
              <Timeline logoUrl="/sushma-logo.jpg" />
            </div>
          </div>
        </div>
      </GridWrapper>
    </div>
  );
}

