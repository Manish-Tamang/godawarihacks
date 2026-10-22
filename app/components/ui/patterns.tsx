import { useId } from "react";
import { cn } from "../../lib/utils";

interface PatternProps {
  className?: string;
}

/** Square line grid, drawn in `currentColor`. */
export function GridPattern({
  className,
  size = 60,
  strokeWidth = 1,
  x = -1,
  y = -1,
}: PatternProps & {
  size?: number;
  strokeWidth?: number;
  x?: number;
  y?: number;
}) {
  const id = useId();

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0", className)}
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={id}
          x={x}
          y={y}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect fill={`url(#${id})`} width="100%" height="100%" />
    </svg>
  );
}

/** 2px dot matrix on a 12px pitch, drawn in `currentColor`. */
export function DotsPattern({ className }: PatternProps) {
  const id = useId();

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0", className)}
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={id}
          x="-1"
          y="-1"
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <rect x="1" y="1" width="2" height="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect fill={`url(#${id})`} width="100%" height="100%" />
    </svg>
  );
}
