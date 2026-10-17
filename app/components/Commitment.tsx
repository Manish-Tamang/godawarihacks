"use client";

import { useRef, useState } from "react";
import { GridWrapper } from "./GridWrapper";
import Image from "next/image";
import { PortableTextContent } from "./PortableTextContent";
import type { RichTextValue } from "@/sanity/lib/portable-text";

interface PartnerData {
  _key: string;
  name: string;
  logo?: { asset?: { _id: string; url: string }; alt?: string } | null;
  url?: string;
}

interface CommitmentProps {
  title?: string;
  description?: RichTextValue;
  partners?: PartnerData[];
}

const portraits = [
  { src: "/Boy.png", alt: "Boy", width: 375, height: 619 },
  { src: "/girl.png", alt: "Girl", width: 471, height: 646 },
];

function DraggablePortraits() {
  const boxRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    index: number;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  } | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [positions, setPositions] = useState([
    { x: 16, y: 12 },
    { x: 150, y: 24 },
  ]);

  function onPointerDown(index: number, event: React.PointerEvent<HTMLButtonElement>) {
    const box = boxRef.current;
    if (!box) return;
    const elRect = event.currentTarget.getBoundingClientRect();
    drag.current = {
      index,
      offsetX: event.clientX - elRect.left,
      offsetY: event.clientY - elRect.top,
      width: elRect.width,
      height: elRect.height,
    };
    setActive(index);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    const box = boxRef.current;
    if (!current || !box) return;
    const bounds = box.getBoundingClientRect();
    const x = Math.min(
      Math.max(0, event.clientX - bounds.left - current.offsetX),
      bounds.width - current.width,
    );
    const y = Math.min(
      Math.max(0, event.clientY - bounds.top - current.offsetY),
      bounds.height - current.height,
    );
    setPositions((prev) => prev.map((pos, i) => (i === current.index ? { x, y } : pos)));
  }

  function onPointerUp() {
    drag.current = null;
    setActive(null);
  }

  return (
    <div
      ref={boxRef}
      className="relative h-[420px] touch-none md:h-full md:min-h-[460px]"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {portraits.map((photo, index) => (
        <button
          key={photo.src}
          type="button"
          aria-label={`Drag ${photo.alt}`}
          onPointerDown={(event) => onPointerDown(index, event)}
          className="absolute cursor-grab bg-transparent p-0 active:cursor-grabbing"
          style={{
            left: positions[index].x,
            top: positions[index].y,
            zIndex: active === index ? 2 : 1,
          }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            draggable={false}
            className="pointer-events-none h-[300px] w-auto select-none md:h-[380px]"
          />
        </button>
      ))}
    </div>
  );
}

export function Commitment({ title, description }: CommitmentProps) {
  return (
    <GridWrapper className="before:hidden">
      <div className="relative -mt-16 grid grid-cols-1 md:grid-cols-[60%_40%]">
        <div className="absolute bottom-0 left-[60%] top-0 hidden w-px bg-border-primary/50 md:block"></div>
        <div className="ml-8 flex flex-col items-start justify-center space-y-6 py-8 pr-8 md:pr-12">
          <h2 className="text-left text-4xl font-bold text-text-primary md:text-5xl">
            {title || "Our commitment"}
          </h2>
          <div className="text-left text-lg leading-relaxed text-[#084750] md:text-xl">
            {description ? (
              <PortableTextContent value={description} />
            ) : (
              <p>
                Our mission is to host the best ever highschool hackathon in Koshi Province, Nepal. With the help of our sponsors, we will be able to provide a platform for the students to showcase their skills and to learn from each other.
              </p>
            )}
          </div>
          <a
            href="#sponsors"
            className="inline-flex items-center gap-2 text-base font-medium text-text-primary transition-colors hover:text-[#084750]/80"
          >
            View Our Sponsors
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <DraggablePortraits />
      </div>
    </GridWrapper>
  );
}
