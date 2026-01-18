"use client";

import React from "react";
import { StickyCanvas, StickyNote } from "react-sticky-canvas";
import Image from "next/image";
import { MainSiteLayout } from "../components/MainSiteLayout";
import { GridWrapper } from "../components/GridWrapper";
import { AnimatedText } from "../components/AnimatedText";
import { Gaegu } from 'next/font/google';

import { REVIEW_DATA } from "./data";

const gaegu = Gaegu({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-gaegu'
});

export default function ReviewPage() {
    const HEADER_DELAY = 0.2;
    const [mounted, setMounted] = React.useState(false);
    const [itemPositions, setItemPositions] = React.useState<{ x: number; y: number }[]>([]);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setMounted(true);

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
            <div ref={containerRef} className="relative min-h-screen bg-bg-primary dark:bg-neutral-900">

                {/* Global Sticky Canvas Overlay */}
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

                <div className="relative z-0">
                    <section className="relative py-12 md:py-16 text-center space-y-6">
                        <AnimatedText
                            as="h1"
                            delay={HEADER_DELAY}
                            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#084750] to-[#0a5a63] dark:from-white dark:to-gray-300 tracking-tight"
                        >
                            Project Reviews
                        </AnimatedText>
                        <AnimatedText
                            as="p"
                            delay={HEADER_DELAY + 0.1}
                            className="text-text-secondary text-lg max-w-2xl mx-auto px-4"
                        >
                            Feedback for all the amazing teams! Drag notes anywhere on the page.
                        </AnimatedText>
                    </section>

                    {REVIEW_DATA.map((team, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <GridWrapper key={team.id}>
                                <div className="py-12 md:py-16 px-4 md:px-8">
                                    <div className={`flex flex-col gap-8 md:gap-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                        <div className="w-full md:w-1/2 space-y-2">
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

                                        <div
                                            id={`team-board-${index}`}
                                            className="w-full md:w-1/2 h-[350px] relative bg-gray-50 dark:bg-neutral-800/50 border border-dashed border-border-primary rounded-xl overflow-hidden shadow-inner opacity-60"
                                        >
                                        </div>
                                    </div>
                                </div>
                            </GridWrapper>
                        );
                    })}
                    <GridWrapper>
                        <div className="py-8 md:py-12">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 px-4">
                                <div className="flex-1 space-y-3">
                                    <p className="text-sm md:text-base text-text-secondary">
                                        Draggable Canvas Sticky Notes Review{" "}
                                        <span className="text-[#084750] dark:text-gray-300 font-medium">Godawari Hacks</span>
                                    </p>
                                    <p className="text-sm md:text-base text-text-tertiary leading-relaxed">
                                        Celebrating innovation and creativity at Sushma Godawari College.
                                    </p>
                                </div>
                                <div className="flex-shrink-0 bg-gray-100 mr-2">
                                    <div className="w-[80px] h-[80px] relative rounded-square overflow-hidden border border-primary/50">
                                        <Image
                                            src="/profile.png"
                                            alt="golecodes"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <p className="text-sm md:text-sm text-text-secondary">Event Coodinator: <br /> Manish Gole Tamang</p>
                                </div>
                            </div>
                        </div>
                    </GridWrapper>
                </div>
            </div>
        </MainSiteLayout>
    );
}
