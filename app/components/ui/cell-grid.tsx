import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

/**
 * Grid of cells split by 1px hairlines. Each cell draws its own right and
 * bottom rule and the outermost ones are clipped, so a half-filled last row
 * stays blank rather than exposing a background colour through the gaps.
 * Pass the column classes (`grid-cols-*`) via `className`.
 */
export function CellGrid({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          "-mb-px -mr-px grid [&>*]:border-b [&>*]:border-r [&>*]:border-grid-border",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
