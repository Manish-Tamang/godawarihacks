"use client";

import React from "react";
import { StickyCanvas, StickyNote } from "react-sticky-canvas";
import Image from "next/image";
import { GridPageLayout } from "../components/GridPageLayout";
import { GridSection } from "../components/ui/grid-section";
import { PageHero } from "../components/ui/page-hero";
import { DotsPattern } from "../components/ui/patterns";
import { Gaegu } from "next/font/google";

import { REVIEW_DATA } from "./data";

const gaegu = Gaegu({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gaegu",
});

export default function Review1Page() {
  const [itemPositions, setItemPositions] = React.useState<
    { x: number; y: number }[]
  >([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

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
            y: rect.top - containerRect.top,
          };
        }
        return { x: 0, y: 0 };
      });
      setItemPositions(newPositions);
    };

    calculatePositions();

    window.addEventListener("resize", calculatePositions);
    const timer = setTimeout(calculatePositions, 100);

    return () => {
      window.removeEventListener("resize", calculatePositions);
      clearTimeout(timer);
    };
  }, []);

  return (
    <GridPageLayout>
      {/* The notes canvas spans every board, so the boards' positions are
                measured relative to this wrapper. */}
      <div ref={containerRef} className="relative">
        <div className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-hidden">
          <StickyCanvas className="h-full w-full">
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
                    <div
                      className={`pointer-events-auto flex h-full cursor-grab select-none items-center justify-center p-2 text-center text-sm leading-snug text-gray-800 active:cursor-grabbing ${gaegu.className}`}
                    >
                      {note.text}
                    </div>
                  }
                />
              ));
            })}
          </StickyCanvas>
        </div>

        <PageHero
          align="center"
          title="Project Reviews"
          description={
            <p>
              Feedback for all the amazing teams! Drag notes anywhere on the
              page.
            </p>
          }
        />

        {REVIEW_DATA.map((team, index) => {
          const isEven = index % 2 === 0;
          return (
            <GridSection
              key={team.id}
              innerClassName={`grid grid-cols-1 divide-grid-border max-md:divide-y md:grid-cols-2 md:divide-x ${isEven ? "" : "md:[&>*:first-child]:order-2"}`}
            >
              <div className="space-y-4 p-5 sm:p-10">
                <h2 className="font-display text-2xl font-medium text-neutral-900">
                  {team.name}
                </h2>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-neutral-200">
                  <Image
                    src="/hall.jpg"
                    alt={team.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-neutral-500">{team.description}</p>
              </div>

              <div className="bg-neutral-50 p-5 sm:p-10">
                <div
                  id={`team-board-${index}`}
                  className="relative h-[350px] overflow-hidden rounded-xl border border-dashed border-neutral-300 bg-white/60"
                />
              </div>
            </GridSection>
          );
        })}

        <GridSection innerClassName="px-4 py-14 sm:px-12">
          <div className="absolute inset-4">
            <DotsPattern className="text-neutral-200/80" />
          </div>
          <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <div className="grow space-y-3 text-center sm:text-left">
              <p className="text-pretty text-lg text-neutral-800 sm:text-xl">
                Draggable Canvas Sticky Notes Review{" "}
                <span className="font-medium text-neutral-900">
                  Godawari Hacks
                </span>
              </p>
              <p className="text-neutral-500">
                Celebrating innovation and creativity at Sushma Godawari
                College.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-center text-center sm:items-end sm:text-right">
              <Image
                src="/profile.png"
                alt="golecodes"
                width={80}
                height={80}
                className="size-16 rounded-full border border-neutral-200 bg-neutral-100 object-cover"
              />
              <p className="mt-3 text-xs text-neutral-500">
                Event Coordinator: <br />
                <span className="text-sm font-semibold text-neutral-700">
                  Manish Gole Tamang
                </span>
              </p>
            </div>
          </div>
        </GridSection>
      </div>
    </GridPageLayout>
  );
}
