import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { GridPattern } from "./patterns";

/** Shared look for text inputs, selects and textareas. */
export const inputClassName =
  "block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export const fileInputClassName = cn(
  inputClassName,
  "py-1.5 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-brand-light",
);

/** Label above a control, with an optional hint underneath. */
export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-neutral-900"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}

/**
 * Band that holds a form: an 800px white column with the line grid showing
 * in the gutters either side.
 */
export function FormPanel({ children }: { children: ReactNode }) {
  return (
    <section className="grid-section relative overflow-clip border-y border-grid-border px-4">
      <div className="relative z-0 mx-auto max-w-grid-width border-x border-grid-border">
        <div className="relative overflow-hidden lg:bg-neutral-50">
          <GridPattern
            x={-31}
            strokeWidth={2}
            className="left-1/2 hidden w-[1200px] -translate-x-1/2 text-grid-border opacity-60 lg:block"
          />
          <div className="relative mx-auto max-w-[800px] border-grid-border bg-white p-6 sm:p-8 lg:border-x">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
