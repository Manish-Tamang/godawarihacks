"use client";

import { GridWrapper } from "./GridWrapper";
import { AnimatedText } from "./AnimatedText";

export function About() {
  return (
    <div className="space-y-4 -mt-8">
      <h2 className="text-[#084750] ml-4 text-balance text-left text-3xl font-medium leading-10 tracking-tight md:text-4xl">
        About Godawari Hack
      </h2>
      <div className="space-y-6">
        <p className="text-left ml-4 text-text-secondary leading-relaxed">
          Godawari Hack is a 24 hours highschool hackathon organized by Students of Sushma Godawari College (+2 Students) where 30+ teams competes each other to build the best project in 24 hours.
        </p>
        <GridWrapper className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative mx-auto max-w-5xl px-4 md:px-8">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border-primary/50 -translate-x-1/2"></div>

            <div className="space-y-2 flex flex-col mt-4 mb-6 justify-center">
              <h3 className="text-xl font-semibold text-text-primary">Our Commitment</h3>
              <p className="text-text-secondary leading-relaxed">
                We&apos;re dedicated to organizing the biggest and best highschool hackathon in Koshi Province, Nepal. With the help of our sponsors, we will be able to provide a platform for the students to showcase their skills and to learn from each other.
              </p>
            </div>

            <div className="space-y-2 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-text-primary">What to Expect</h3>
              <ul className="space-y-1 text-text-secondary">
                <li className="flex items-start">
                  <span className="text-[#084750] mr-2">•</span>
                  <span>24 hours of intense coding and problem-solving</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#084750] mr-2">•</span>
                  <span>Networking opportunities with fellow developers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#084750] mr-2">•</span>
                  <span>Mentorship from industry experts and Session from our <span className="underline decoration-wavy text-[#084750]" >Special International Guest</span></span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#084750] mr-2">•</span>
                  <span>Prizes and recognition for winning teams</span>
                </li>
              </ul>
            </div>
          </div>
        </GridWrapper>
      </div>
    </div>
  );
}

