"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { GridSection } from "./ui/grid-section";
import { SectionHeading } from "./ui/section-heading";
import { Button } from "./ui/button";
import { GridPattern } from "./ui/patterns";
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
    { x: 40, y: 32 },
    { x: 180, y: 48 },
  ]);

  function onPointerDown(
    index: number,
    event: React.PointerEvent<HTMLButtonElement>,
  ) {
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
    setPositions((prev) =>
      prev.map((pos, i) => (i === current.index ? { x, y } : pos)),
    );
  }

  function onPointerUp() {
    drag.current = null;
    setActive(null);
  }

  return (
    <div
      ref={boxRef}
      className="relative h-[420px] touch-none overflow-hidden md:h-full md:min-h-[460px]"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <GridPattern className="text-neutral-200 [mask-image:radial-gradient(black,transparent_85%)]" />
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
            className="pointer-events-none h-[300px] w-auto select-none drop-shadow-md md:h-[380px]"
          />
        </button>
      ))}
    </div>
  );
}

export function Commitment({ title, description }: CommitmentProps) {
  return (
    <GridSection
      className="bg-neutral-50"
      innerClassName="grid grid-cols-1 md:grid-cols-2"
    >
      <SectionHeading
        className="justify-center px-4 py-14 sm:px-10"
        title={title || "Our commitment"}
        description={
          description ? (
            <PortableTextContent value={description} />
          ) : (
            <p>
              Our mission is to host the best ever highschool hackathon in Koshi
              Province, Nepal. With the help of our sponsors, we will be able to
              provide a platform for the students to showcase their skills and
              to learn from each other.
            </p>
          )
        }
      >
        <Button href="#sponsors" variant="secondary">
          View Our Sponsors
        </Button>
      </SectionHeading>
      <div className="border-grid-border max-md:border-t md:border-l">
        <DraggablePortraits />
      </div>
    </GridSection>
  );
}
