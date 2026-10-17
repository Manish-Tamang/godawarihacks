import Image from "next/image";
import Link from "next/link";
import { AnimatedText } from "./AnimatedText";
import { EncryptedText } from "./ui/encrypted-text";
import { PortableTextContent } from "./PortableTextContent";
import type { RichTextValue } from "@/sanity/lib/portable-text";

interface HeroProps {
  title?: string;
  tagline?: RichTextValue;
  subtitle?: RichTextValue;
  collegeName?: string;
  collegeUrl?: string;
  isRegistrationOpen: boolean;
}

const HEADING_DELAY = 0.2;
const PARAGRAPH_DELAY = 0.3;

export function Hero({
  title,
  tagline,
  subtitle,
  collegeName,
  collegeUrl,
  isRegistrationOpen,
}: HeroProps) {
  return (
    <section className="relative mt-14 pb-12 md:pb-16">
      <div className="relative z-10 pt-36 md:pt-44 text-balance flex flex-col items-center justify-center">
        <a
          href={collegeUrl || "https://www.facebook.com/sushmagodawari"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="rounded-full w-[300px] user-select-none bg-gray-200 text-center">
            <Image
              className="rounded-full w-5 h-5 inline-block"
              src="/sushma-logo.jpg"
              alt="Sushma Godawari College Logo"
              width={20}
              height={20}
            />{" "}
            {collegeName || "Sushma Godawari College"} Presents
          </div>
        </a>
        <AnimatedText
          as="h1"
          delay={HEADING_DELAY}
          className="mx-auto flex w-full justify-center text-center font-helvetica text-5xl font-bold leading-tight tracking-tighter text-[#084750] md:text-8xl md:leading-[88px]"
        >
          <EncryptedText
            text={title || "Godawari <Hacks/>"}
            encryptedClassName="text-neutral-500"
            revealedClassName="text-[#084750]"
            revealDelayMs={50}
          />
        </AnimatedText>
        <div className="mt-4 text-center">
          <AnimatedText
            as="div"
            delay={PARAGRAPH_DELAY}
            className="leading-4 text-text-secondary text-base md:text-lg max-w-3xl mx-auto"
          >
            {tagline ? (
              <PortableTextContent value={tagline} />
            ) : (
              <p>
                Join highschool teams of passionate students for an epic 24-hour
                coding hackathon at Sushma Godawari College.
              </p>
            )}
          </AnimatedText>
        </div>
        <div className="mt-4 text-center">
          <AnimatedText
            as="div"
            delay={PARAGRAPH_DELAY + 0.1}
            className="text-sm md:text-base text-text-tertiary leading-relaxed max-w-2xl mx-auto"
          >
            {subtitle ? (
              <PortableTextContent value={subtitle} />
            ) : (
              <p>
                A student-driven hackathon inspiring teens to explore, build, and
                innovate with technology. Sushma Godawari College, Itahari,
                Nepal.
              </p>
            )}
          </AnimatedText>
        </div>
        <Link href={isRegistrationOpen ? "/register" : "/"}>
          <div className="mt-6 text-center">
            <div
              className={`inline-block ${!isRegistrationOpen ? "cursor-not-allowed" : ""} bg-[#084750] text-white px-6 py-3 rounded-square text-sm md:text-base font-medium`}
            >
              {isRegistrationOpen ? "Register Now" : "Registration Closed"}
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
