import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface GridSectionProps extends HTMLAttributes<HTMLElement> {
  /** Classes for the centred column (padding, layout, its own background). */
  innerClassName?: string;
}

/**
 * Full-bleed band with a centred 1080px column framed by vertical rules.
 * Every homepage section is one of these; consecutive bands share a single
 * horizontal rule (see `.grid-section` in globals.css).
 */
export function GridSection({
  children,
  className,
  innerClassName,
  ...props
}: GridSectionProps) {
  return (
    <section
      className={cn(
        "grid-section relative scroll-mt-14 overflow-clip border-y border-grid-border px-4",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "relative z-0 mx-auto max-w-grid-width border-x border-grid-border",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
