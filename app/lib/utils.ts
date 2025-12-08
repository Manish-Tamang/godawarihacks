import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cx = (...classes) => classes.filter(Boolean).join(" ");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a blur data URL for use as a placeholder in Next.js Image components.
 * This creates a tiny SVG image that can be blurred for a loading effect.
 * Returns a pre-computed base64 encoded SVG for optimal performance.
 */
export function generateBlurDataURL(): string {
  // Pre-computed base64 encoded SVG (10x10 gray square)
  // This is a lightweight placeholder that Next.js will blur automatically
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U1ZTdlYiIvPjwvc3ZnPg==";
}
