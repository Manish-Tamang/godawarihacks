import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SectionHeadingProps {
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  /** Buttons or links shown under the copy. */
  children?: ReactNode;
  className?: string;
}

export function SectionHeading({
  title,
  description,
  align = "left",
  children,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center"
          ? "items-center text-center"
          : "items-start text-left",
        className,
      )}
    >
      <h2 className="max-w-2xl text-pretty font-display text-3xl font-medium text-neutral-900 sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <div className="mt-3 max-w-xl text-pretty text-base text-neutral-500 sm:text-lg">
          {description}
        </div>
      )}
      {children && <div className="mt-8 flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
