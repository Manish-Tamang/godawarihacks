import Image from "next/image";
import { GridSection } from "./ui/grid-section";
import { DotsPattern } from "./ui/patterns";

/** Site credit, laid out like a customer quote on a dotted card. */
export function MadeBy() {
  return (
    <GridSection innerClassName="px-4 py-14 sm:px-12">
      <div className="absolute inset-4">
        <DotsPattern className="text-neutral-200/80" />
      </div>
      <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:items-start lg:gap-12">
        <div className="grow space-y-3 text-center sm:text-left">
          <p className="text-pretty text-lg text-neutral-800 sm:text-xl md:text-2xl">
            If you are wondering who made this site, it is made by{" "}
            <a
              href="https://manishtamang.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:decoration-brand"
            >
              golecodes
            </a>
          </p>
          <p className="text-pretty text-neutral-500">
            A +2 Science graduate of Sushma Godawari College (2024–2026 batch),
            passionate about full stack web app development.
          </p>
        </div>
        <Image
          src="/profile.png"
          alt="golecodes"
          width={120}
          height={120}
          className="size-20 shrink-0 select-none rounded-full border border-neutral-200 bg-neutral-100 object-cover"
          draggable={false}
        />
      </div>
    </GridSection>
  );
}
