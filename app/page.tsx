import { GridWrapper } from "./components/GridWrapper";
import { AnimatedText } from "./components/AnimatedText";
import { Stats } from "./components/Stats";
import { Schedule } from "./components/Schedule";
import { Sponsors } from "./components/Sponsors";
import { Team } from "./components/Team";
import { About } from "./components/About";
import { PhotoGrid } from "./components/PhotoGrid";
import { RegisterSection } from "./components/RegisterSection";
import { Commitment } from "./components/Commitment";
import { PrizePool } from "./components/PrizePool";
import { Venue } from "./components/Venue";
import { EncryptedText } from "./components/ui/encrypted-text";
import { MainSiteLayout } from "./components/MainSiteLayout";
import Image from "next/image";
import Link from "next/link";


export default async function Home() {
  const PROFILE_DELAY = 0;
  const HEADING_DELAY = PROFILE_DELAY + 0.2;
  const PARAGRAPH_DELAY = HEADING_DELAY + 0.1;
  const STATS_DELAY = PARAGRAPH_DELAY + 0.1;

  return (
    <MainSiteLayout>
      <section className="mt-6 space-y-10 md:mt-0 md:space-y-16 pb-0 bg-bg-primary dark:bg-neutral-900">
        <section className="relative py-12 md:py-16 bg-bg-primary dark:bg-neutral-900">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-blue-50/30 to-transparent dark:from-neutral-800 dark:via-neutral-800/30 dark:to-transparent -z-10"></div>
          <div
            className="absolute inset-0 opacity-[0.03] -z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23007cff' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            }}
          ></div>
          <div className="relative text-balance flex flex-col items-center justify-center">
            <a href="https://www.facebook.com/sushmagodawari" target="_blank" rel="noopener noreferrer"><div className="rounded-full w-[300px] user-select-none bg-gray-200 text-center"><Image className="rounded-full w-5 h-5 inline-block" src="/sushma-logo.jpg" alt="Sushma Godawari College Logo" width={20} height={20} /> Sushma Godawari College Presents</div></a>
            <AnimatedText
              as="h1"
              delay={HEADING_DELAY}
              className="mx-auto max-w-2xl text-center text-5xl font-bold leading-tight tracking-tighter text-[#084750] md:text-7xl md:leading-[78px]"
            >
              <EncryptedText
                text="Godawari <Hacks/>"
                encryptedClassName="text-neutral-500"
                revealedClassName="text-[#084750]"
                revealDelayMs={50}
              />
            </AnimatedText>
            <div className="mt-4 text-center ">
              <AnimatedText
                as="p"
                delay={PARAGRAPH_DELAY}
                className="leading-4 text-text-secondary text-base md:text-lg max-w-3xl mx-auto"
              >
                Join highschool teams of passionate students for an epic 24-hour coding hackathon at Sushma Godawari College.
              </AnimatedText>
            </div>

            <div className="mt-4 text-center">
              <AnimatedText
                as="p"
                delay={PARAGRAPH_DELAY + 0.1}
                className="text-sm md:text-base text-text-tertiary leading-relaxed max-w-2xl mx-auto"
              >
                A student-driven hackathon inspiring teens to explore, build, and innovate with technology.
                Sushma Godawari College, Itahari, Nepal.
              </AnimatedText>
            </div>
            <Link href="/">
              <div className="mt-6 text-center">
                <div className="inline-block cursor-not-allowed bg-[#084750] text-white px-6 py-3 rounded-square text-sm md:text-base font-medium">
                  Registration Closed
                </div>
              </div>
            </Link>
          </div>
        </section>
        <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <PhotoGrid />
        </section>
        <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <Stats delay={STATS_DELAY} />
        </section>
        <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <RegisterSection />
        </section>
        <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <Commitment />
        </section>
        <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <PrizePool />
        </section>
        <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <Venue />
        </section>
        <section id="about" className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <About />
        </section>
        <section id="schedule" className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <Schedule />
        </section>
        <section id="sponsors" className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <Sponsors />
        </section>
        <section id="team" className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <Team />
        </section>
        <section id="contact" className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <div className="text-center space-y-6 -mt-8">
            <h2 className="text-3xl -mb-4 md:text-4xl font-bold text-text-primary">
              Ready to Code?
            </h2>
            <p className="text-lg md:text-xl text-text-secondary">
              Register now and be part of the most exciting hackathon of the year!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/register"
                className="px-8 py-4 mb-4 bg-[#084750] text-white font-semibold rounded-square hover:bg-[#084750]/80 transition-colors"
              >
                Register Now
              </a>
              <a
                href="/about"
                className="px-8 py-4 mb-4 border-2 border-border-primary text-text-primary font-semibold rounded-square hover:bg-gray-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
        <section className="relative space-y-8 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
          <GridWrapper>
            <div className="py-8 md:py-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 px-4">
                <div className="flex-1 space-y-3">
                  <p className="text-sm md:text-base text-text-secondary">
                    If you are wondering who made this site, it is made by{" "}
                    <a
                      href="https://manishtamang.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#084750] hover:text-[#084750]/80 underline font-medium"
                    >
                      golecodes
                    </a>
                  </p>
                  <p className="text-sm md:text-base text-text-tertiary leading-relaxed">
                    He is an +2 science student of Sushma godawari college passionate about full stack web app development.
                  </p>
                </div>
                <div className="flex-shrink-0 bg-gray-100 mr-2">
                  <Image
                    src="/profile.png"
                    alt="golecodes"
                    width={120}
                    height={120}
                    className="rounded-square object-cover border border-primary/50 select-none"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </GridWrapper>
        </section>
      </section>
    </MainSiteLayout>
  );
}
