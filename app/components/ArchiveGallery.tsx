"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type ArchivePhoto = {
  _id: string;
  alt: string;
  caption?: string;
  image?: {
    asset?: {
      _id: string;
      url: string;
      metadata?: {
        lqip?: string;
        dimensions?: { width: number; height: number };
      };
    };
  };
};

export function ArchiveGallery({ photos }: { photos: ArchivePhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
  );
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? i : (i - 1 + photos.length) % photos.length,
      ),
    [photos.length],
  );

  return (
    <>
      <div className="columns-2 gap-2 md:columns-3 lg:columns-4 [&>*]:mb-2">
        {photos.map((photo, index) => {
          const asset = photo.image?.asset;
          if (!asset?.url) return null;
          const dims = asset.metadata?.dimensions;

          return (
            <button
              key={photo._id}
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`View photo: ${photo.alt}`}
              className="group relative block w-full cursor-zoom-in overflow-hidden break-inside-avoid focus:outline-none focus-visible:ring-2 focus-visible:ring-[#084750] focus-visible:ring-offset-2"
            >
              <Image
                src={asset.url}
                alt={photo.alt}
                width={dims?.width ?? 1200}
                height={dims?.height ?? 1600}
                placeholder={asset.metadata?.lqip ? "blur" : "empty"}
                blurDataURL={asset.metadata?.lqip}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 280px"
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              {photo.caption && (
                <span
                  className="pointer-events-none absolute bottom-1.5 right-2 z-20 font-mono tabular-nums"
                  style={{
                    fontSize: "10px",
                    color: "rgb(255, 138, 61)",
                    textShadow: "rgba(255, 110, 40, 0.45) 0px 0px 6px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {photo.caption}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {openIndex !== null && (
        <Lightbox
          photo={photos[openIndex]}
          index={openIndex}
          total={photos.length}
          onClose={close}
          onNext={next}
          onPrev={prev}
        />
      )}
    </>
  );
}

function Lightbox({
  photo,
  index,
  total,
  onClose,
  onNext,
  onPrev,
}: {
  photo: ArchivePhoto;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const asset = photo.image?.asset;
  const dims = asset?.metadata?.dimensions;

  useEffect(() => {
    closeRef.current?.focus();
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

  if (!asset?.url) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      <NavButton side="left" onClick={onPrev} />
      <NavButton side="right" onClick={onNext} />

      <figure
        className="relative flex max-h-[90vh] max-w-[92vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={asset.url}
          alt={photo.alt}
          width={dims?.width ?? 1600}
          height={dims?.height ?? 2000}
          placeholder={asset.metadata?.lqip ? "blur" : "empty"}
          blurDataURL={asset.metadata?.lqip}
          sizes="92vw"
          priority
          className="max-h-[82vh] w-auto object-contain"
        />
        <figcaption className="mt-3 flex items-center gap-3 text-xs text-white/60">
          {photo.caption && (
            <span
              className="font-mono tabular-nums"
              style={{
                color: "rgb(255, 138, 61)",
                textShadow: "rgba(255, 110, 40, 0.45) 0px 0px 6px",
                letterSpacing: "0.04em",
              }}
            >
              {photo.caption}
            </span>
          )}
          <span className="font-mono tabular-nums">
            {index + 1} / {total}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

function NavButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white ${
        side === "left" ? "left-2 md:left-6" : "right-2 md:right-6"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path
          d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
