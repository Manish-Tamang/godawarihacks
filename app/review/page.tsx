"use client";

import React from "react";
import { StickyCanvas, StickyNote } from "react-sticky-canvas";
import Image from "next/image";
import { GridWrapper } from "../components/GridWrapper";
import { AnimatedText } from "../components/AnimatedText";
import { MainSiteLayout } from "../components/MainSiteLayout";
import { Gaegu } from 'next/font/google';

import { REVIEW_DATA } from "./data";

const gaegu = Gaegu({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-gaegu'
});

export default function Review1Page() {
    const HEADING_DELAY = 0.2;
    const PARAGRAPH_DELAY = HEADING_DELAY + 0.1;

    const [itemPositions, setItemPositions] = React.useState<{ x: number; y: number }[]>([]);
    const containerRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        const calculatePositions = () => {
            if (!containerRef.current) return;
            const containerRect = containerRef.current.getBoundingClientRect();

            const newPositions = REVIEW_DATA.map((_, index) => {
                const el = document.getElementById(`team-board-${index}`);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    return {
                        x: rect.left - containerRect.left,
                        y: rect.top - containerRect.top
                    };
                }
                return { x: 0, y: 0 };
            });
            setItemPositions(newPositions);
        };

        calculatePositions();

        window.addEventListener('resize', calculatePositions);
        const timer = setTimeout(calculatePositions, 100);

        return () => {
            window.removeEventListener('resize', calculatePositions);
            clearTimeout(timer);
        };
    }, []);

    return (
        <MainSiteLayout>
            <section ref={containerRef} className="mt-6 space-y-10 p-10 md:mt-0 md:space-y-16 pb-0 bg-bg-primary dark:bg-neutral-900">
                {/* Sticky Notes Canvas */}
                <div className="absolute inset-0 z-10 w-full h-full pointer-events-none overflow-hidden">
                    <StickyCanvas className="w-full h-full">
                        {REVIEW_DATA.map((team, index) => {
                            const pos = itemPositions[index];
                            if (!pos) return null;

                            return team.notes.map((note) => (
                                <StickyNote
                                    key={`${team.id}-${note.id}`}
                                    id={`${team.id}-${note.id}`}
                                    color={note.color}
                                    initialX={pos.x + note.x}
                                    initialY={pos.y + note.y}
                                    initialRotation={note.rotate}
                                    width={120}
                                    height={120}
                                    content={
                                        <div className={`flex items-center justify-center h-full p-2 text-center text-sm text-gray-800 leading-snug select-none cursor-grab active:cursor-grabbing pointer-events-auto ${gaegu.className}`}>
                                            {note.text}
                                        </div>
                                    }
                                />
                            ));
                        })}
                    </StickyCanvas>
                </div>

                {/* Hero Section - Same as Homepage */}
                <section className="relative py-12 md:py-16 bg-bg-primary dark:bg-neutral-900">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-blue-50/30 to-transparent dark:from-neutral-800 dark:via-neutral-800/30 dark:to-transparent -z-10"></div>
                    <div
                        className="absolute inset-0 opacity-[0.03] -z-10"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23007cff' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
                        }}
                    ></div>
                    <div className="relative text-balance flex flex-col items-center justify-center">
                        <AnimatedText
                            as="h1"
                            delay={HEADING_DELAY}
                            className="mx-auto max-w-2xl text-center text-5xl font-bold leading-tight tracking-tighter text-[#084750] md:text-7xl md:leading-[78px]"
                        >
                            Project Reviews
                        </AnimatedText>
                        <div className="mt-4 text-center">
                            <AnimatedText
                                as="p"
                                delay={PARAGRAPH_DELAY}
                                className="leading-4 text-text-secondary text-base md:text-lg max-w-3xl mx-auto"
                            >
                                Feedback for all the amazing teams! Drag notes anywhere on the page.
                            </AnimatedText>
                        </div>
                    </div>
                </section>

                {/* Team Reviews Section */}
                <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
                    {REVIEW_DATA.map((team, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <GridWrapper key={team.id}>
                                <div className="py-8 md:py-12">
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isEven ? '' : 'md:[&>*:first-child]:order-2'}`}>
                                        {/* Team Info Column */}
                                        <div className="space-y-2 p-10">
                                            <h2 className="text-2xl font-bold text-text-primary">{team.name}</h2>
                                            <div className="relative aspect-video w-full overflow-hidden rounded-square border border-border-primary/50 shadow-sm">
                                                <Image
                                                    src="/hall.jpg"
                                                    alt={team.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <p className="text-text-secondary">{team.description}</p>
                                        </div>

                                        {/* Sticky Notes Board Column */}
                                        <div
                                            id={`team-board-${index}`}
                                            className="h-[350px] ml-10 mr-10 relative bg-gray-50 dark:bg-neutral-800/50 border border-dashed border-border-primary rounded-square overflow-hidden shadow-inner opacity-60"
                                        >
                                        </div>
                                    </div>
                                </div>
                            </GridWrapper>
                        );
                    })}

                    {/* Footer Section */}
                    <GridWrapper>
                        <div className="py-6 md:py-8">
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-center md:items-start">
                                <div className="space-y-3">
                                    <p className="text-sm md:text-base text-text-secondary">
                                        Draggable Canvas Sticky Notes Review{" "}
                                        <span className="text-[#084750] dark:text-gray-300 font-medium">Godawari Hacks</span>
                                    </p>
                                    <p className="text-sm md:text-base text-text-tertiary leading-relaxed">
                                        Celebrating innovation and creativity at Sushma Godawari College.
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-[80px] h-[80px] relative rounded-square overflow-hidden border border-primary/50">
                                        <Image
                                            src="/profile.png"
                                            alt="golecodes"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <p className="text-sm text-text-secondary mt-2">Event Coordinator: <br /> Manish Gole Tamang</p>
                                </div>
                            </div>
                        </div>
                    </GridWrapper>
                </section>
            </section>
        </MainSiteLayout>
    );
}
