"use client";

import { useEffect, useState } from "react";
import { GridWrapper } from "./GridWrapper";

export function RegisterSection() {
    const [daysUntil, setDaysUntil] = useState<number>(0);

    useEffect(() => {
        const hackathonDate = new Date("2026-01-18T11:00:00");
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        hackathonDate.setHours(0, 0, 0, 0);

        const diffTime = hackathonDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setDaysUntil(Math.max(0, diffDays));
    }, []);

    return (
        <GridWrapper className="before:hidden">
            <div className="text-center space-y-6 py-8 -mt-12">
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
                    Register your team now!
                </h2>

                <div className="flex justify-center items-center my-6">
                    <div className="text-8xl md:text-9xl">🎉</div>
                </div>

                <p className="text-lg md:text-xl text-text-secondary font-medium">
                    {daysUntil} {daysUntil === 1 ? "Day" : "Days"} until Godawari Hacks
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <a
                        href="/register"
                        className="px-8 py-4 bg-[#084750] text-white font-semibold rounded-square hover:bg-[#084750]/80 transition-colors"
                    >
                        Register Team
                    </a>
                    <a
                        href="#rules"
                        className="px-8 py-4 bg-[#084750] text-white font-semibold rounded-square hover:bg-[#084750]/80 transition-colors"
                    >
                        View Rules
                    </a>
                </div>
            </div>
        </GridWrapper>
    );
}

