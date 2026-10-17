"use client";

import { GridWrapper } from "./GridWrapper";
import { PortableTextContent } from "./PortableTextContent";
import type { RichTextValue } from "@/sanity/lib/portable-text";

interface AboutValue {
  _key: string;
  title: string;
  description?: RichTextValue;
}

interface Expectation {
  _key: string;
  text: string;
}

interface AboutProps {
  title?: string;
  description?: RichTextValue;
  values?: AboutValue[];
  expectations?: Expectation[];
}

export function About({ title, description, values, expectations }: AboutProps) {
  const aboutValues = values?.slice(0, 2) ?? [
    { _key: "v1", title: "Our Commitment", description: undefined },
    { _key: "v2", title: "What to Expect", description: undefined },
  ];
  const expectationItems = expectations ?? [
    { _key: "e1", text: "24 hours of intense coding and problem-solving" },
    { _key: "e2", text: "Networking opportunities with fellow developers" },
    { _key: "e3", text: "Mentorship from industry experts" },
    { _key: "e4", text: "Prizes and recognition for winning teams" },
  ];

  return (
    <div className="space-y-6 -mt-8">
      <div className="space-y-4 px-4 md:px-6">
        <h2 className="text-[#084750] text-balance text-left text-3xl font-medium leading-10 tracking-tight md:text-4xl">
          {title || "About Godawari Hacks"}
        </h2>
        <div className="text-left text-text-secondary leading-relaxed max-w-3xl">
          {description ? (
            <PortableTextContent value={description} />
          ) : (
            <p>
              Godawari Hacks is a 24 hours highschool hackathon organized by Students of Sushma Godawari College (+2 Students) where 30+ teams competes each other to build the best project in 24 hours.
            </p>
          )}
        </div>
      </div>
      <GridWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border-primary/50 -translate-x-1/2"></div>
          <div className="space-y-3 flex flex-col justify-start px-4 md:px-6 py-6 md:py-8">
            <h3 className="text-xl font-semibold text-text-primary">{aboutValues[0]?.title || "Our Commitment"}</h3>
            <div className="text-text-secondary leading-relaxed">
              {aboutValues[0]?.description ? (
                <PortableTextContent value={aboutValues[0].description} />
              ) : (
                <p>
                  We&apos;re dedicated to organizing the biggest and best highschool hackathon in Koshi Province, Nepal. With the help of our sponsors, we will be able to provide a platform for the students to showcase their skills and to learn from each other.
                </p>
              )}
            </div>
          </div>
          <div className="space-y-3 flex flex-col justify-start px-4 md:px-6 py-6 md:py-8">
            <h3 className="text-xl font-semibold text-text-primary">{aboutValues[1]?.title || "What to Expect"}</h3>
            <ul className="space-y-2 text-text-secondary">
              {expectationItems.map((item) => (
                <li key={item._key} className="flex items-start gap-2">
                  <span className="shrink-0 text-[#084750] leading-relaxed">•</span>
                  <span className="leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </GridWrapper>
    </div>
  );
}
