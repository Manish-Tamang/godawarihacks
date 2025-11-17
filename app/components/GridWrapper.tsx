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
        "before:absolute before:top-0 before:h-px before:bg-border-primary/50 before:z-50",
        "before:left-[calc(-50vw+50%)] before:w-screen",
        "after:absolute after:bottom-0 after:h-px after:bg-border-primary/50 after:z-50",
        "after:left-[calc(-50vw+50%)] after:w-screen",
      )}
    >
      {children}
    </div>
  );
}
