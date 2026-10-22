import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

/**
 * Rounded tab that the band above "drips" into the top of the next band.
 * It is filled with `currentColor`, so set `text-*` to the colour of the
 * band above.
 */
export function Notch({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto flex h-16 max-w-[min(700px,calc(100vw-2rem))] -translate-y-px items-start justify-center",
        className,
      )}
    >
      <NotchCurve className="h-full w-auto shrink-0 translate-x-px translate-y-px overflow-visible" />
      <div className="relative z-10 h-[calc(100%+1px)] min-w-0 grow bg-current">
        {children}
      </div>
      <NotchCurve className="h-full w-auto shrink-0 -translate-x-px translate-y-px -scale-x-100 overflow-visible" />
    </div>
  );
}

function NotchCurve({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 85 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="0"
        y="0"
        width="85"
        height="1"
        fill="currentColor"
        transform="translate(0, -1)"
      />
      <path
        d="M50 45C57.3095 56.6952 71.2084 63.9997 85 64V0H0C13.7915 0 26.6905 7.30481 34 19L50 45Z"
        fill="currentColor"
      />
    </svg>
  );
}
