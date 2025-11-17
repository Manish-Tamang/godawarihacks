import { GridWrapper } from "./GridWrapper";
import Image from "next/image";

export function HackathonCommitment() {
  return (
    <GridWrapper className="before:hidden">
      <div className="grid grid-cols-1 -mt-16 md:grid-cols-[60%_40%] relative">
        <div className="hidden md:block absolute left-[60%] top-0 bottom-0 w-px bg-border-primary/50"></div>
        <div className="flex flex-col justify-center items-left ml-8 space-y-6 py-8 pr-8 md:pr-12">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary text-left">
            Our commitment
          </h2>
          <p className="text-lg md:text-xl text-blue-600 leading-relaxed text-left">
            Our mission is to host the best web development conference in Texas, provide value for engineers of all experience levels, and donate everything to charity. That&apos;s our commitment.
          </p>
          <a
            href="#financial-report"
            className="inline-flex items-center gap-2 text-base font-medium text-text-primary hover:text-blue-600 transition-colors"
          >
            View 2024 financial report
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
        <div className="flex flex-col">
          <div className="p-6 pl-8 md:pl-12 border-b border-border-primary/50 flex items-center justify-center gap-4 min-h-[120px]">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image src="/sushma-logo.jpg" alt="Sushma Godawari College" width={64} height={64} className="object-cover" />
            </div>
            <div>
              <p className="text-base font-bold text-text-primary tracking-wide">Sushma Godawari College</p>
            </div>
          </div>

          <div className="p-6 pl-8 md:pl-12 border-b border-border-primary/50 flex items-center justify-center gap-4 min-h-[120px]">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image src="/connect-club.jpg" alt="Connect Club Sushma Godawari College" width={64} height={64} className="object-cover" />
            </div>
            <div>
              <p className="text-base font-bold text-text-primary tracking-wide">Connect Club (Sushma Godawari College)</p>
            </div>
          </div>

          <div className="p-6 pl-8 md:pl-12 flex items-center justify-center gap-4 min-h-[120px]">

          </div>
        </div>
      </div>
    </GridWrapper>
  );
}

