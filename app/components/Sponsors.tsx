"use client";

import { GridWrapper } from "./GridWrapper";
import { AnimatedText } from "./AnimatedText";
import { motion } from "framer-motion";

interface Sponsor {
    name: string;
    logo?: string;
}

const sponsors: Sponsor[] = [
    { name: "My Second Teacher" },
    { name: "Code Academy" },
    { name: "Dev Tools Inc" },
    { name: "Startup Hub" },
    { name: "Cloud Services" },
    { name: "Design Studio" },
    { name: "Local Business 1" },
    { name: "Local Business 2" },
    { name: "Local Business 3" },
];

export function Sponsors() {
    return (
        <div className="space-y-4 -mt-8">
            <h2 className="max-w-lg ml-4 -mb-2 text-balance text-left text-3xl font-medium leading-10 tracking-tight text-[#084750] md:text-4xl">
                Our Sponsors
            </h2>
            <p className="text-left text-text-secondary max-w-2xl mb-8 ml-4">
                We wouldn&apos;t be able to do what we do without the support of our generous sponsors.
            </p>
            <GridWrapper>
                <div className="grid grid-cols-3 gap-0 divide-x divide-border-primary">
                    {sponsors.map((sponsor, index) => (
                        <motion.div
                            key={sponsor.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                ease: "easeOut",
                                delay: index * 0.1,
                            }}
                            className="aspect-square border border-border-primary flex items-center justify-center hover:shadow-md transition-shadow"
                        >
                            <div className="text-lg font-semibold text-text-primary text-center p-4">{sponsor.name}</div>
                        </motion.div>
                    ))}
                </div>
            </GridWrapper>
            <div className="text-center pt-2">
                <p className="text-text-secondary mb-2">
                    Interested in sponsoring? We&apos;d love to hear from you!
                </p>
                <a
                    href="/contact"
                    className="inline-block px-6 py-3 bg-[#084750] text-white font-semibold rounded-square hover:bg-[#084750]/80 transition-colors"
                >
                    Sponsor / Contact Us
                </a>
            </div>
        </div>
    );
}

