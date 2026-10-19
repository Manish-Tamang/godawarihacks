"use client";

import Video from "next-video";
import { GridWrapper } from "./GridWrapper";

const COLLEGE_VIDEO_URL =
  "https://gijsdu2tbgehdfyf.public.blob.vercel-storage.com/sushma-ai-bootcamp.mp4";

const programs = [
  { _key: "p0", text: "+2 (Higher Secondary) including Science, Hotel Management" },
  { _key: "p1", text: "4-year B.Sc. CSIT, 8 semesters (Tribhuvan University)" },
  { _key: "p2", text: "4-year Bachelor of Business Studies (BBS), English and Nepali medium (Tribhuvan University)" },
  { _key: "p3", text: "3-year Diploma in Civil and Computer Engineering (SKMEC, CTEVT)" },
  { _key: "p4", text: "Short-term training in plumbing, house wiring, electrical and electronics" },
];

const facilities = [
  { _key: "f1", text: "Boarding facilities" },
  { _key: "f2", text: "Libraries in both school and college" },
  { _key: "f3", text: "Computer and Science labs" },
  { _key: "f4", text: "Canteen and first aid facilities" },
];

export function CollegeAbout() {
  return (
    <div className="space-y-6 -mt-8">
      <div className="space-y-4 px-4 md:px-6">
        <h2 className="text-[#084750] text-balance text-left text-3xl font-medium leading-10 tracking-tight md:text-4xl">
          About Sushma Godawari College
        </h2>
        <div className="text-left text-text-secondary leading-relaxed max-w-3xl space-y-4">
          <p className="font-medium text-text-primary">
            Knowledge for today. Confidence for tomorrow.
          </p>
          <p>
            <a
              href="https://www.godawari.edu.np/"
              target="_blank"
              rel="noopener"
              className="text-[#084750] hover:text-[#084750]/80 underline font-medium"
            >
              Sushma Godawari College
            </a>{" "}
            (सुस्मा गोदावरी कलेज) is one of the oldest and largest colleges in Itahari, Sunsari, Nepal. Established in 1992 A.D. (2049 B.S.), the college offers +2 (higher secondary) education alongside bachelor&apos;s programs affiliated with Tribhuvan University.
          </p>
          <p>
            It also established the CTEVT-recognized Sushma Koirala Memorial Engineering College (SKMEC) in 2057 B.S. (c. 2000 A.D.).
          </p>
        </div>
      </div>
      <GridWrapper className="before:hidden">
        <div className="px-4 md:px-6 py-6">
          <div className="relative w-full overflow-hidden rounded-square bg-gray-900">
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
      </GridWrapper>
      <GridWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border-primary/50 -translate-x-1/2"></div>
          <div className="space-y-3 flex flex-col justify-start px-4 md:px-6 py-6 md:py-8">
            <h3 className="text-xl font-semibold text-text-primary">Programs</h3>
            <ul className="space-y-2 text-text-secondary">
              {programs.map((item) => (
                <li key={item._key} className="flex items-start gap-2">
                  <span className="shrink-0 text-[#084750] leading-relaxed">•</span>
                  <span className="leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 flex flex-col justify-start px-4 md:px-6 py-6 md:py-8">
            <h3 className="text-xl font-semibold text-text-primary">Facilities</h3>
            <ul className="space-y-2 text-text-secondary">
              {facilities.map((item) => (
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
