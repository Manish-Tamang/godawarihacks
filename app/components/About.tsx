import { GridSection } from "./ui/grid-section";
import { SectionHeading } from "./ui/section-heading";
import { CheckList } from "./ui/check-list";
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

export function About({
  title,
  description,
  values,
  expectations,
}: AboutProps) {
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
    <GridSection id="about" innerClassName="pt-10 sm:pt-20">
      <SectionHeading
        className="px-4 sm:px-10"
        title={title || "About Godawari Hacks"}
        description={
          description ? (
            <PortableTextContent value={description} />
          ) : (
            <p>
              Godawari Hacks is a 24 hours highschool hackathon organized by
              Students of Sushma Godawari College (+2 Students) where 30+ teams
              competes each other to build the best project in 24 hours.
            </p>
          )
        }
      />
      <div className="mt-10 grid grid-cols-1 divide-grid-border border-t border-grid-border max-md:divide-y sm:mt-16 md:grid-cols-2 md:divide-x">
        <div className="px-4 py-10 sm:px-10">
          <h3 className="text-lg font-medium text-neutral-900">
            {aboutValues[0]?.title || "Our Commitment"}
          </h3>
          <div className="mt-3 leading-relaxed text-neutral-500">
            {aboutValues[0]?.description ? (
              <PortableTextContent value={aboutValues[0].description} />
            ) : (
              <p>
                We&apos;re dedicated to organizing the biggest and best
                highschool hackathon in Koshi Province, Nepal. With the help of
                our sponsors, we will be able to provide a platform for the
                students to showcase their skills and to learn from each other.
              </p>
            )}
          </div>
        </div>
        <div className="px-4 py-10 sm:px-10">
          <h3 className="text-lg font-medium text-neutral-900">
            {aboutValues[1]?.title || "What to Expect"}
          </h3>
          <div className="mt-3">
            <CheckList items={expectationItems} />
          </div>
        </div>
      </div>
    </GridSection>
  );
}
