import Image from "next/image";
import { EncryptedText } from "./ui/encrypted-text";
import { PortableTextContent } from "./PortableTextContent";
import { Button } from "./ui/button";
import { GridPattern } from "./ui/patterns";
import { ArrowUpRightIcon } from "./icons/ui-icons";
import type { RichTextValue } from "@/sanity/lib/portable-text";

interface HeroProps {
  title?: string;
  tagline?: RichTextValue;
  subtitle?: RichTextValue;
  collegeName?: string;
  collegeUrl?: string;
  isRegistrationOpen: boolean;
  background: { src: string; width: number; height: number; alt?: string };
}

// Staggered entrance shared by every line of the hero; each element sets its
// own `--offset` and `animation-delay`.
const REVEAL =
  "animate-slide-up-fade [animation-duration:1s] [animation-fill-mode:both] motion-reduce:animate-fade-in";

export function Hero({
  title,
  tagline,
  subtitle,
  collegeName,
  collegeUrl,
  isRegistrationOpen,
  background,
}: HeroProps) {
  return (
    <section className="grid-section relative overflow-clip px-4">
      <div className="relative z-0 mx-auto max-w-grid-width px-4 pb-20 pt-16 sm:px-12">
        <HeroBackdrop background={background} />

        <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-4 text-center">
          <a
            href={collegeUrl || "https://www.facebook.com/sushmagodawari"}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center divide-x divide-neutral-300 rounded-full border border-neutral-300 bg-white text-xs font-medium drop-shadow-sm transition-colors duration-75 [--offset:10px] hover:bg-neutral-50 ${REVEAL}`}
          >
            <span className="flex items-center gap-2 py-1.5 pl-1.5 pr-2.5 text-neutral-800">
              <Image
                className="size-5 rounded-full"
                src="/sushma-logo.jpg"
                alt="Sushma Godawari College Logo"
                width={20}
                height={20}
              />
              {collegeName || "Sushma Godawari College"} Presents
            </span>
            <span className="p-1.5 pl-2">
              <span className="block rounded-full bg-neutral-100 p-0.5 text-neutral-500">
                <ArrowUpRightIcon
                  strokeWidth={3}
                  className="size-2.5 transition-transform duration-100 group-hover:-translate-y-px group-hover:translate-x-px"
                />
              </span>
            </span>
          </a>

          <h1
            className={`mt-5 text-pretty text-center font-display text-4xl font-medium text-neutral-900 [--offset:20px] [animation-delay:100ms] sm:text-5xl sm:leading-[1.15] md:text-6xl ${REVEAL}`}
          >
            <EncryptedText
              text={title || "Godawari <Hacks/>"}
              encryptedClassName="text-neutral-400"
              revealedClassName="text-neutral-900"
              revealDelayMs={50}
            />
          </h1>

          <div
            className={`mt-5 text-pretty text-base text-neutral-600 [--offset:10px] [animation-delay:200ms] sm:text-xl ${REVEAL}`}
          >
            {tagline ? (
              <PortableTextContent value={tagline} />
            ) : (
              <p>
                Join highschool teams of passionate students for an epic 24-hour
                coding hackathon at Sushma Godawari College.
              </p>
            )}
          </div>

          <div
            className={`mt-3 text-pretty text-sm text-neutral-500 [--offset:10px] [animation-delay:250ms] sm:text-base ${REVEAL}`}
          >
            {subtitle ? (
              <PortableTextContent value={subtitle} />
            ) : (
              <p>
                A student-driven hackathon inspiring teens to explore, build,
                and innovate with technology. Sushma Godawari College, Itahari,
                Nepal.
              </p>
            )}
          </div>
        </div>

        <div
          className={`relative mx-auto mt-10 flex max-w-fit [--offset:5px] [animation-delay:300ms] ${REVEAL}`}
        >
          <Button
            href={isRegistrationOpen ? "/register" : "/"}
            disabled={!isRegistrationOpen}
          >
            {isRegistrationOpen ? "Register Now" : "Registration Closed"}
          </Button>
        </div>
      </div>
    </section>
  );
}

/**
 * The faded event photo plus the line grid: inside the column the grid
 * clears behind the copy, outside it the grid fans out into the margins.
 */
function HeroBackdrop({ background }: Pick<HeroProps, "background">) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(45%_70%_at_50%_0%,black,transparent)]">
        <Image
          src={background.src}
          alt={background.alt || ""}
          width={background.width}
          height={background.height}
          priority
          sizes="1080px"
          className="size-full object-cover opacity-[0.15] grayscale"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 border-x border-grid-border [mask-image:linear-gradient(transparent,black)]" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[1800px] -translate-x-1/2 [mask-image:linear-gradient(transparent,black)]">
        <div className="absolute inset-x-[360px] inset-y-0">
          <GridPattern
            x={0}
            y={0}
            strokeWidth={2}
            className="inset-[unset] bottom-0 right-full h-[600px] w-[360px] text-grid-border/60 [mask-image:linear-gradient(90deg,transparent,black)]"
          />
          <GridPattern
            y={0}
            strokeWidth={2}
            className="inset-[unset] bottom-0 left-full h-[600px] w-[360px] text-grid-border/60 [mask-image:linear-gradient(270deg,transparent,black)]"
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-px inset-y-0 overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(transparent,black),radial-gradient(130%_50%_at_50%_100%,transparent,black)]">
        <GridPattern
          y={0}
          strokeWidth={2}
          className="inset-[unset] bottom-0 left-1/2 h-[600px] w-grid-width -translate-x-1/2 text-grid-border/60"
        />
      </div>
    </>
  );
}
