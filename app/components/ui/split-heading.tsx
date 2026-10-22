import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

/** Heading on the left, supporting copy on the right (stacks on mobile). */
export function SplitHeading({
  title,
  children,
  className,
}: {
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-x-24 gap-y-6 lg:grid-cols-2",
        className,
      )}
    >
      <h2 className="max-w-[472px] text-pretty text-3xl font-medium tracking-[-0.02em] text-neutral-900">
        {title}
      </h2>
      {children && (
        <div className="max-w-[500px] text-pretty text-lg leading-7 tracking-[-0.02em] text-neutral-500">
          {children}
        </div>
      )}
    </div>
  );
}
