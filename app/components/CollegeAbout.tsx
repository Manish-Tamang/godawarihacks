"use client";

import Video from "next-video";
import { GridSection } from "./ui/grid-section";
import { SectionHeading } from "./ui/section-heading";
import { CheckList } from "./ui/check-list";

const COLLEGE_VIDEO_URL =
  "https://gijsdu2tbgehdfyf.public.blob.vercel-storage.com/sushma-ai-bootcamp.mp4";

const programs = [
  {
    _key: "p0",
    text: "+2 (Higher Secondary) including Science, Hotel Management",
  },
  { _key: "p1", text: "4-year B.Sc. CSIT, 8 semesters (Tribhuvan University)" },
  {
    _key: "p2",
    text: "4-year Bachelor of Business Studies (BBS), English and Nepali medium (Tribhuvan University)",
  },
  {
    _key: "p3",
    text: "3-year Diploma in Civil and Computer Engineering (SKMEC, CTEVT)",
  },
  {
    _key: "p4",
    text: "Short-term training in plumbing, house wiring, electrical and electronics",
  },
];

const facilities = [
  { _key: "f1", text: "Boarding facilities" },
  { _key: "f2", text: "Libraries in both school and college" },
  { _key: "f3", text: "Computer and Science labs" },
  { _key: "f4", text: "Canteen and first aid facilities" },
];

export function CollegeAbout() {
  return (
    <GridSection id="college" innerClassName="pt-10 sm:pt-20">
      <SectionHeading
        className="px-4 sm:px-10"
        title="About Sushma Godawari College"
        description={
          <div className="space-y-4">
            <p className="font-medium text-neutral-900">
              Knowledge for today. Confidence for tomorrow.
            </p>
            <p>
              <a
                href="https://www.godawari.edu.np/"
                target="_blank"
                rel="noopener"
                className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900"
              >
                Sushma Godawari College
              </a>{" "}
              (सुस्मा गोदावरी कलेज) is one of the oldest and largest colleges in
              Itahari, Sunsari, Nepal. Established in 1992 A.D. (2049 B.S.), the
              college offers +2 (higher secondary) education alongside
              bachelor&apos;s programs affiliated with Tribhuvan University.
            </p>
            <p>
              It also established the CTEVT-recognized Sushma Koirala Memorial
              Engineering College (SKMEC) in 2057 B.S. (c. 2000 A.D.).
            </p>
          </div>
        }
      />

      <div className="mt-10 border-y border-grid-border bg-neutral-50 px-4 py-8 sm:mt-16 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-[940px] rounded-2xl border border-neutral-200 bg-white/50 p-2 shadow-sm">
          <div className="overflow-hidden rounded-xl bg-neutral-900">
            <Video
              src={COLLEGE_VIDEO_URL}
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              className="aspect-video w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-grid-border max-md:divide-y md:grid-cols-2 md:divide-x">
        <div className="px-4 py-10 sm:px-10">
          <h3 className="text-lg font-medium text-neutral-900">Programs</h3>
          <div className="mt-3">
            <CheckList items={programs} />
          </div>
        </div>
        <div className="px-4 py-10 sm:px-10">
          <h3 className="text-lg font-medium text-neutral-900">Facilities</h3>
          <div className="mt-3">
            <CheckList items={facilities} />
          </div>
        </div>
      </div>
    </GridSection>
  );
}
