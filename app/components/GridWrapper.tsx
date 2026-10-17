import clsx from "clsx";

export function GridWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        className,
        "relative w-full",
        "before:absolute before:inset-x-0 before:top-0 before:z-50 before:h-px before:bg-border-primary/50",
        "after:absolute after:inset-x-0 after:bottom-0 after:z-50 after:h-px after:bg-border-primary/50",
      )}
    >
      {children}
    </div>
  );
}
