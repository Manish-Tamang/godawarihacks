import { BgGradient } from "./components/BgGradient";
import { GridWrapper } from "./components/GridWrapper";
import { AnimatedText } from "./components/AnimatedText";
import { HackathonStats } from "./components/HackathonStats";
import { HackathonSchedule } from "./components/HackathonSchedule";
import { HackathonSponsors } from "./components/HackathonSponsors";
import { HackathonTeam } from "./components/HackathonTeam";
import { HackathonAbout } from "./components/HackathonAbout";
import { HackathonPhotoGrid } from "./components/HackathonPhotoGrid";
import { HackathonRegister } from "./components/HackathonRegister";
import { HackathonCommitment } from "./components/HackathonCommitment";
import { HackathonPrizePool } from "./components/HackathonPrizePool";
import { HackathonVenue } from "./components/HackathonVenue";
import { EncryptedText } from "./components/ui/encrypted-text";

export default async function Home() {
  const PROFILE_DELAY = 0;
  const HEADING_DELAY = PROFILE_DELAY + 0.2;
  const PARAGRAPH_DELAY = HEADING_DELAY + 0.1;
  const STATS_DELAY = PARAGRAPH_DELAY + 0.1;

  return (
    <section className="mt-6 space-y-10 md:mt-0 md:space-y-16 pb-0">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-blue-50/30 to-transparent -z-10"></div>
        <div
          className="absolute inset-0 opacity-[0.03] -z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23007cff' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="relative text-balance">

          <AnimatedText
            as="h1"
            delay={HEADING_DELAY}
            className="mx-auto max-w-2xl text-center text-6xl font-bold leading-tight tracking-tighter text-blue-600 md:text-8xl md:leading-[78px]"
          >
            <EncryptedText
              text="Hack Sushma"
              encryptedClassName="text-neutral-500"
              revealedClassName="text-blue-600"
              revealDelayMs={50}
            />
          </AnimatedText>
          <div className="mt-4 text-center md:mt-8">
            <AnimatedText
              as="p"
              delay={PARAGRAPH_DELAY}
              className="leading-8 text-text-secondary text-base md:text-lg max-w-3xl mx-auto"
            >
              Join 20+ teams of passionate developers for an epic 12-hour coding marathon at Sushma Code fest on December 3, 2024!
            </AnimatedText>
          </div>

          <div className="mt-4 text-center">
            <AnimatedText
              as="p"
              delay={PARAGRAPH_DELAY + 0.1}
              className="text-sm md:text-base text-text-tertiary leading-relaxed max-w-2xl mx-auto"
            >
              Sushma Code fest was founded to be a hackathon that gives back to the community, all while fostering innovation and collaboration among developers.
            </AnimatedText>
          </div>
          <div className="mt-6 text-center">
            <div className="inline-block bg-blue-600 text-white px-6 py-3 rounded-square text-sm md:text-base font-medium">
              Tickets are 100% free. All we ask is you make a commitment to show up and code!
            </div>
          </div>
        </div>
      </section>

      {/* Photo Grid Section */}
      <section className="relative space-y-10 md:space-y-16">
        <HackathonPhotoGrid />
      </section>

      {/* Stats Section */}
      <section className="relative space-y-10 md:space-y-16">
        <HackathonStats delay={STATS_DELAY} />
      </section>

      {/* Register Section */}
      <section className="relative space-y-10 md:space-y-16">
        <HackathonRegister />
      </section>

      {/* Commitment Section */}
      <section className="relative space-y-10 md:space-y-16">
        <HackathonCommitment />
      </section>

      {/* Prize Pool Section */}
      <section className="relative space-y-10 md:space-y-16">
        <HackathonPrizePool />
      </section>

      {/* Venue Section */}
      <section className="relative space-y-10 md:space-y-16">
        <HackathonVenue />
      </section>

      {/* About Section */}
      <section id="about" className="relative space-y-10 md:space-y-16">
        <HackathonAbout />
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="relative space-y-10 md:space-y-16">
        <HackathonSchedule />
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="relative space-y-10 md:space-y-16">
        <HackathonSponsors />
      </section>

      {/* Team Section */}
      <section id="team" className="relative space-y-10 md:space-y-16">
        <HackathonTeam />
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative space-y-10 md:space-y-16">

        <div className="text-center space-y-6 -mt-8">
          <h2 className="text-3xl -mb-4 md:text-4xl font-bold text-text-primary">
            Ready to Code?
          </h2>
          <p className="text-lg md:text-xl text-text-secondary">
            Register now and be part of the most exciting hackathon of the year!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#register"
              className="px-8 py-4 mb-4 bg-blue-600 text-white font-semibold rounded-square hover:bg-blue-700 transition-colors"
            >
              Register Now
            </a>
            <a
              href="#learn-more"
              className="px-8 py-4 mb-4 border-2 border-border-primary text-text-primary font-semibold rounded-square hover:bg-gray-50 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
