import { GridWrapper } from "../components/GridWrapper";
import { AnimatedText } from "../components/AnimatedText";
import { MainSiteLayout } from "../components/MainSiteLayout";
import { Team } from "../components/Team";
import Image from "next/image";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import { PortableTextContent } from "../components/PortableTextContent";
import type { RichTextValue } from "@/sanity/lib/portable-text";

export const metadata: Metadata = {
    title: "About - Godawari Hacks",
    description: "Learn about Godawari Hacks, our mission, values, and what makes our hackathon special. Join a community-driven event that brings together passionate developers.",
};

type HomePageAbout = {
    about?: {
        title?: string;
        values?: Array<{ _key: string; title: string; description?: RichTextValue }>;
        expectations?: Array<{ _key: string; text: string }>;
    };
    team?: TeamMemberData[];
} | null;

type TeamMemberData = {
    _id: string;
    name: string;
    role: string;
    faculty?: string;
    image?: {
        asset?: { _id: string; url: string; metadata?: { lqip?: string } };
        alt?: string;
    } | null;
};

export default async function AboutPage() {
    const HEADING_DELAY = 0.2;
    const PARAGRAPH_DELAY = HEADING_DELAY + 0.1;

    const homePage = await sanityFetch<HomePageAbout>({
        query: HOME_PAGE_QUERY,
        tags: ["homePage", "teamMember"],
    });

    const values = homePage?.about?.values ?? [];

    return (
        <div className="relative isolate">
            <div className="pointer-events-none -mt-4 absolute inset-x-0 top-0 -z-10 mx-auto w-full max-w-[1150px] overflow-hidden">
                <Image
                    src="/hackathon/bg.jpg"
                    alt=""
                    width={1600}
                    height={821}
                    priority
                    sizes="(max-width: 1150px) 100vw, 1150px"
                    className="block h-auto w-full grayscale-[50%] [mask-image:linear-gradient(to_bottom,black_0%,black_35%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_35%,transparent_100%)]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/30 to-bg-primary dark:via-neutral-900/30 dark:to-neutral-900" />
            </div>
        <MainSiteLayout>
            <section className="space-y-10 md:space-y-16 pb-0">
                <section className="relative mt-14 pb-12 md:pb-16">
                    <div className="relative z-10 flex flex-col items-center pt-36 text-balance md:pt-44">
                        <AnimatedText
                            as="h1"
                            delay={HEADING_DELAY}
                            className="mx-auto w-full max-w-4xl text-center font-helvetica text-5xl font-bold leading-tight tracking-tighter text-[#084750] md:text-7xl md:leading-[80px]"
                        >
                            {homePage?.about?.title || "About Godawari Hacks"}
                        </AnimatedText>
                        <div className="mt-4 text-center md:mt-6">
                            <AnimatedText
                                as="p"
                                delay={PARAGRAPH_DELAY}
                                className="mx-auto max-w-2xl px-4 text-base leading-7 text-text-secondary md:text-lg"
                            >
                                A student organized hackathon that brings together passionate students to build, learn, and innovate together.
                            </AnimatedText>
                        </div>
                    </div>
                </section>

                <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
                    <GridWrapper className="before:hidden">
                        <div className="space-y-4 py-8 md:py-12 -mt-16">
                            <h2 className="px-4 text-balance text-left text-3xl font-medium leading-10 tracking-tight text-[#084750] md:px-6 md:text-4xl">
                                Our Mission
                            </h2>
                            <div className="space-y-6 px-4 md:px-6">
                                <p className="text-left text-text-secondary leading-relaxed max-w-4xl">
                                    Godawari Hacks was founded with a simple yet powerful mission: to create a hackathon that gives back to the community while fostering innovation and collaboration among developers. We believe that technology should be accessible to everyone, and that the best solutions come from diverse teams working together.
                                </p>
                                <p className="text-left text-text-secondary leading-relaxed max-w-4xl">
                                    Our event is designed to be inclusive, educational, and fun. Whether you&apos;re a beginner taking your first steps in coding or an experienced developer looking to build something amazing, there&apos;s a place for you at Godawari Hacks.
                                </p>
                            </div>
                        </div>
                    </GridWrapper>
                </section>
                <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
                    <GridWrapper className="before:hidden">
                        <div className="relative px-4 md:px-6 py-8 md:py-12 -mt-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
                                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border-primary/50 -translate-x-1/2"></div>

                                {values.slice(1).map((value, index) => (
                                    <div key={value._key} className={`space-y-4 flex flex-col justify-center ${index < 2 ? "pb-8 md:pb-12" : ""}`}>
                                        <h3 className="text-xl font-semibold text-text-primary">{value.title}</h3>
                                        <div className="text-text-secondary leading-relaxed">
                                            {value.description ? (
                                                <PortableTextContent value={value.description} />
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute left-4 md:left-6 right-4 md:right-6 top-1/2 -translate-y-1/2 h-px bg-border-primary/50"></div>
                        </div>
                    </GridWrapper>
                </section>
                <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
                    <GridWrapper>
                        <div className="space-y-4 py-8 md:py-12">
                            <h2 className="px-4 text-balance text-left text-3xl font-medium leading-10 tracking-tight text-[#084750] md:px-6 md:text-4xl">
                                What to Expect
                            </h2>
                            <div className="space-y-6 px-4 md:px-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                                    {(homePage?.about?.expectations ?? []).map((item) => (
                                        <div key={item._key} className="space-y-2">
                                            <h3 className="text-lg font-semibold text-text-primary">{item.text}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </GridWrapper>
                </section>

                <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
                    <GridWrapper className="before:hidden">
                        <div className="relative py-8 -mt-16">
                            <div className="relative w-full h-[400px] md:h-[500px] rounded-square overflow-hidden">
                                <Image
                                    src="/hackathon/615441793_1496629622471458_2605852539031229038_n.jpg"
                                    alt="Godawari Hacks Event"
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

                <section className="relative space-y-10 md:space-y-16 bg-bg-primary dark:bg-neutral-900">
                    <Team
                        title="Meet our founding team of Godawari Hacks 2026"
                        description="The students who brought Godawari Hacks 2026 to life through community, creativity, and collaboration."
                        members={homePage?.team}
                    />
                </section>
            </section>
        </MainSiteLayout>
        </div>
    );
}
