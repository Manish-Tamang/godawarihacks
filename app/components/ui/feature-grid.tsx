import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

/** Row of short feature blurbs, each hung off a thin vertical rule. */
export function FeatureGrid({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FeatureItem({
  icon,
  title,
  children,
}: {
  icon?: ReactNode;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative flex flex-col pl-6 pr-2 text-sm text-neutral-900">
      <div className="absolute -left-px top-0 h-full w-px bg-neutral-200" />
      {icon}
      <h3 className={cn("font-medium", icon && "mt-2")}>{title}</h3>
      <div className="mt-3.5 space-y-1 text-neutral-500">{children}</div>
    </div>
  );
}
