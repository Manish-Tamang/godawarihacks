import { BgGradient } from "../components/BgGradient";
import { GridWrapper } from "../components/GridWrapper";
import { AnimatedText } from "../components/AnimatedText";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About - Hack Sushma",
    description: "Learn about Hack Sushma, our mission, values, and what makes our hackathon special. Join a community-driven event that brings together passionate developers.",
};

export default async function AboutPage() {
    const HEADING_DELAY = 0.2;
    const PARAGRAPH_DELAY = HEADING_DELAY + 0.1;

    return (
        <section className="mt-6 space-y-10 md:mt-0 md:space-y-16 pb-0">
            <section className="relative py-12 md:py-16">
                <BgGradient />
                <div
                    className="absolute inset-0 opacity-[0.10] -z-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23007cff' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
                    }}
                ><Image src="/cover-sushma.jpg" alt="Hack Sushma" width={300} height={300} className="w-full h-full object-cover" /></div>
                <div className="relative text-balance">
                    <AnimatedText
                        as="h1"
                        delay={HEADING_DELAY}
                        className="mx-auto max-w-2xl text-center text-6xl font-bold leading-tight tracking-tighter text-[#084750] md:text-8xl md:leading-[78px]"
                    >
                        About Hack Sushma
                    </AnimatedText>
                    <div className="mt-4 text-center md:mt-8">
                        <AnimatedText
                            as="p"
                            delay={PARAGRAPH_DELAY}
                            className="leading-8 text-text-secondary text-base md:text-lg max-w-3xl mx-auto"
                        >
                            A community-driven hackathon that brings together passionate developers to build, learn, and innovate together.
                        </AnimatedText>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="relative space-y-10 md:space-y-16">
                <GridWrapper className="before:hidden">
                    <div className="space-y-6 py-8 md:py-12 -mt-16">
                        <h2 className="text-[#084750] ml-4 text-balance text-left text-3xl font-medium leading-10 tracking-tight md:text-4xl">
                            Our Mission
                        </h2>
                        <div className="space-y-6 px-4">
                            <p className="text-left text-text-secondary leading-relaxed max-w-4xl">
                                Hack Sushma was founded with a simple yet powerful mission: to create a hackathon that gives back to the community while fostering innovation and collaboration among developers. We believe that technology should be accessible to everyone, and that the best solutions come from diverse teams working together.
                            </p>
                            <p className="text-left text-text-secondary leading-relaxed max-w-4xl">
                                Our event is designed to be inclusive, educational, and fun. Whether you&apos;re a beginner taking your first steps in coding or an experienced developer looking to build something amazing, there&apos;s a place for you at Hack Sushma.
                            </p>
                        </div>
                    </div>
                </GridWrapper>
            </section>
            <section className="relative space-y-10 md:space-y-16">
                <GridWrapper className="before:hidden">
                    <div className="relative mx-auto max-w-5xl px-4 md:px-8 py-8 md:py-12 -mt-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border-primary/50 -translate-x-1/2"></div>

                            <div className="space-y-4 flex flex-col justify-center pb-8 md:pb-12">
                                <h3 className="text-xl font-semibold text-text-primary">Community First</h3>
                                <p className="text-text-secondary leading-relaxed">
                                    We prioritize the community above all else. Every decision we make is guided by what&apos;s best for our participants, mentors, and the broader developer community.
                                </p>
                            </div>

                            <div className="space-y-4 flex flex-col justify-center pb-8 md:pb-12">
                                <h3 className="text-xl font-semibold text-text-primary">Inclusivity</h3>
                                <p className="text-text-secondary leading-relaxed">
                                    We welcome developers of all skill levels, backgrounds, and experiences. Our goal is to create an environment where everyone feels valued and empowered to contribute.
                                </p>
                            </div>

                            <div className="space-y-4 flex flex-col justify-center">
                                <h3 className="text-xl font-semibold text-text-primary">Innovation</h3>
                                <p className="text-text-secondary leading-relaxed">
                                    We encourage creative thinking and bold ideas. Hack Sushma is a space where you can experiment, take risks, and push the boundaries of what&apos;s possible.
                                </p>
                            </div>

                            <div className="space-y-4 flex flex-col justify-center">
                                <h3 className="text-xl font-semibold text-text-primary">Learning</h3>
                                <p className="text-text-secondary leading-relaxed">
                                    We believe in continuous learning and growth. Through workshops, mentorship, and collaboration, participants leave Hack Sushma with new skills and knowledge.
                                </p>
                            </div>
                        </div>
                        {/* Horizontal border spanning grid width only */}
                        <div className="absolute left-4 md:left-8 right-4 md:right-8 top-1/2 -translate-y-1/2 h-px bg-border-primary/50"></div>
                    </div>
                </GridWrapper>
            </section>
            <section className="relative space-y-10 md:space-y-16">
                <GridWrapper>
                    <div className="space-y-6 py-8 md:py-12">
                        <h2 className="text-[#084750] ml-4 text-balance text-left text-3xl font-medium leading-10 tracking-tight md:text-4xl">
                            What to Expect
                        </h2>
                        <div className="space-y-6 px-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-text-primary">12 Hours of Coding</h3>
                                    <p className="text-text-secondary leading-relaxed">
                                        Intense coding sessions where you&apos;ll build, debug, and deploy your project alongside your team.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-text-primary">Networking Opportunities</h3>
                                    <p className="text-text-secondary leading-relaxed">
                                        Connect with fellow developers, mentors, and industry professionals. Build relationships that last beyond the hackathon.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-text-primary">Mentorship</h3>
                                    <p className="text-text-secondary leading-relaxed">
                                        Get guidance from experienced developers and industry experts who are there to help you succeed.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-text-primary">Prizes & Recognition</h3>
                                    <p className="text-text-secondary leading-relaxed">
                                        Compete for exciting prizes and get recognition for your innovative solutions. Every participant is a winner.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </GridWrapper>
            </section>

            {/* Photo Section */}
            <section className="relative space-y-10 md:space-y-16">
                <GridWrapper className="before:hidden">
                    <div className="relative py-8 -mt-16">
                        <div className="relative w-full h-[400px] md:h-[500px] rounded-square overflow-hidden">
                            <Image
                                src="/hackathon/sushm-1.jpg"
                                alt="Hack Sushma Event"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800/50 to-transparent"></div>
                            <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    Join Us for an Unforgettable Experience
                                </h2>
                                <p className="text-gray-200 max-w-2xl">
                                    Be part of a community that&apos;s passionate about technology, innovation, and making a difference.
                                </p>
                            </div>
                        </div>
                    </div>
                </GridWrapper>
            </section>
        </section>
    );
}

