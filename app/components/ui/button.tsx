import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const VARIANTS = {
  primary:
    "border-brand bg-brand text-white shadow-sm hover:bg-brand-light hover:ring-4 hover:ring-brand/15",
  secondary:
    "border-neutral-200 bg-white text-neutral-900 shadow-sm hover:border-neutral-400 hover:ring-4 hover:ring-neutral-200",
  // For dark backgrounds.
  inverted: "border-white bg-white text-brand ring-white/20 hover:ring",
  glass:
    "border-transparent bg-white/20 text-white ring-white/10 backdrop-blur-sm hover:ring",
} as const;

const SIZES = {
  sm: "h-8 px-4",
  md: "h-10 px-5",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

export function buttonClassName({
  variant = "primary",
  size = "md",
}: { variant?: ButtonVariant; size?: keyof typeof SIZES } = {}) {
  return cn(
    "flex w-fit items-center justify-center whitespace-nowrap rounded-lg border text-sm font-medium transition-all",
    VARIANTS[variant],
    SIZES[size],
  );
}

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: keyof typeof SIZES;
  /** Keeps the link but styles it as unavailable (e.g. registration closed). */
  disabled?: boolean;
}

export function Button({
  href,
  variant,
  size,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <Link
      href={href}
      aria-disabled={disabled || undefined}
      className={cn(
        buttonClassName({ variant, size }),
        disabled && "cursor-not-allowed hover:ring-0",
        className,
      )}
      {...props}
    />
  );
}
