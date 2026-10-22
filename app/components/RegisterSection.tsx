"use client";

import { useEffect, useState } from "react";
import { GridSection } from "./ui/grid-section";
import { SectionHeading } from "./ui/section-heading";
import { Button } from "./ui/button";

export function RegisterSection() {
  const [daysUntil, setDaysUntil] = useState<number>(0);

  useEffect(() => {
    const hackathonDate = new Date("2026-01-18T11:00:00");
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    hackathonDate.setHours(0, 0, 0, 0);

    const diffTime = hackathonDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setDaysUntil(Math.max(0, diffDays));
  }, []);

  return (
    <GridSection innerClassName="px-4 py-20">
      <SectionHeading
        align="center"
        title="Registration Closed!"
        description={
          <>
            <span
              className="my-6 block text-7xl md:text-8xl"
              aria-hidden="true"
            >
              🎉
            </span>
            <span className="font-medium text-neutral-600">
              {daysUntil} {daysUntil === 1 ? "Day" : "Days"} until Godawari
              Hacks
            </span>
          </>
        }
      >
        <Button href="/" disabled>
          Register Team
        </Button>
        <Button href="#rules" variant="secondary">
          View Rules
        </Button>
      </SectionHeading>
    </GridSection>
  );
}
