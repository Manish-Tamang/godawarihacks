import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

const REVEAL =
  "animate-slide-up-fade [--offset:10px] [animation-duration:1s] [animation-fill-mode:both] motion-reduce:animate-fade-in";

interface PageHeroProps {
  title: ReactNode;
  description?: ReactNode;
  /** Line icon shown above a centred title. */
  icon?: ReactNode;
  /** Breadcrumb or other small line above the title. */
  eyebrow?: ReactNode;
  align?: "left" | "center";
  /** Extra content under the copy: meta line, buttons, a cover image. */
  children?: ReactNode;
}

/**
 * Opening band for inner pages. Its side rails fade in from the top so the
 * header sits on clean white, like the homepage hero.
 */
export function PageHero({
  title,
  description,
  icon,
  eyebrow,
  align = "left",
  children,
}: PageHeroProps) {
  const centered = align === "center";

  return (
    <section className="grid-section relative overflow-clip border-b border-grid-border px-4">
      <div className="relative z-0 mx-auto max-w-grid-width px-5 pb-10 pt-16 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 border-x border-grid-border [mask-image:linear-gradient(transparent,black)]" />
        <div
          className={cn(
            "relative flex flex-col gap-3",
            centered
              ? "mx-auto max-w-xl items-center pb-6 text-center"
              : "max-w-[640px]",
          )}
        >
          {eyebrow && <div className={cn("mb-7", REVEAL)}>{eyebrow}</div>}
          {icon && <div className={cn("text-neutral-900", REVEAL)}>{icon}</div>}
          <h1
            className={cn(
              "text-pretty font-display text-4xl font-medium leading-[1.15] tracking-[-0.02em] text-neutral-900 sm:text-[2.5rem]",
              REVEAL,
            )}
          >
            {title}
          </h1>
          {description && (
            <div
              className={cn(
                "text-pretty text-lg text-neutral-600 [animation-delay:100ms]",
                centered && "text-balance sm:text-xl",
                REVEAL,
              )}
            >
              {description}
            </div>
          )}
        </div>
        {children && (
          <div className={cn("relative [animation-delay:200ms]", REVEAL)}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
