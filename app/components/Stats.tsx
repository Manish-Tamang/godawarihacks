"use client";

import { motion } from "framer-motion";
import { GridWrapper } from "./GridWrapper";

interface StatItem {
  number: string;
  label: string;
}

const stats: StatItem[] = [
  { number: "10", label: "Plus Teams" },
  { number: "24", label: "Hours of Grind" },
  { number: "02", label: "Days Session" },
];

export function Stats({ delay = 0 }: { delay?: number }) {
  return (
    <GridWrapper>
      <div className="-mt-16 grid grid-cols-1 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: delay + 0.2 + index * 0.1,
            }}
            className={`
              text-center -mt-8 py-4 relative flex flex-col items-center justify-center min-h-[180px] md:min-h-[200px]
              ${index !== 0 ? "border-l border-border-primary" : ""}
            `}
          >
            <div className="relative flex items-center justify-center min-h-[120px] md:min-h-[140px] w-full">
              <div
                className="text-7xl user-select-none md:text-8xl font-bold leading-none absolute inset-0 flex items-center justify-center"
                style={{
                  WebkitTextStroke: "2px #084750",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                  letterSpacing: "-0.02em",
                  maskImage: "linear-gradient(to bottom, black 0%, black 30%, rgba(0, 0, 0, 0.8) 40%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.2) 60%, transparent 75%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 30%, rgba(0, 0, 0, 0.8) 40%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.2) 60%, transparent 75%)",
                  userSelect: "none",
                }}
              >
                {stat.number}
              </div>
              <div
                className="relative text-2xl md:text-3xl font-bold leading-none text-[#084750] z-10"
                style={{
                  fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                  letterSpacing: "-0.02em"
                }}
              >
                {stat.number}
              </div>
            </div>
            <div className="text-base -mt-[50px] md:-mt-[52px] md:text-lg font-medium text-[#084750]">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </GridWrapper>
  );
}

