import type { ReactNode } from "react";
import { CheckIcon } from "../icons/ui-icons";

export function CheckList({
  items,
}: {
  items: { _key: string; text: ReactNode }[];
}) {
  return (
    <ul className="space-y-2.5 text-neutral-500">
      {items.map((item) => (
        <li key={item._key} className="flex items-start gap-2.5">
          <CheckIcon className="mt-1 size-4 shrink-0 text-neutral-400" />
          <span className="leading-relaxed">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
