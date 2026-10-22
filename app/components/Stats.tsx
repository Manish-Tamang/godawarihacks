import { GridSection } from "./ui/grid-section";

interface StatItem {
  _key: string;
  number: string;
  label: string;
}

export function Stats({ stats }: { stats?: StatItem[] }) {
  const items = stats ?? [
    { _key: "1", number: "10", label: "Plus Teams" },
    { _key: "2", number: "24", label: "Hours of Grind" },
    { _key: "3", number: "02", label: "Days Session" },
  ];

  return (
    <GridSection>
      <dl className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
        {items.map((stat, index) => (
          <div
            key={stat._key}
            className="flex h-28 animate-slide-up-fade flex-col-reverse items-center justify-center gap-1 rounded-xl bg-neutral-100 [--offset:10px] [animation-duration:1s] [animation-fill-mode:both] motion-reduce:animate-fade-in"
            style={{ animationDelay: `${600 + index * 100}ms` }}
          >
            <dt className="text-sm text-neutral-500">{stat.label}</dt>
            <dd className="font-display text-4xl font-medium tabular-nums text-neutral-900">
              {stat.number}
            </dd>
          </div>
        ))}
      </dl>
    </GridSection>
  );
}
