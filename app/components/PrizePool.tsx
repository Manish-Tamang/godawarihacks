import { GridWrapper } from "./GridWrapper";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableTextContent } from "./PortableTextContent";
import type { RichTextValue } from "@/sanity/lib/portable-text";

interface PrizeData {
    _key: string;
    title: string;
    amount?: string;
    description?: string;
    icon?: { asset?: { _id: string; url: string } } | null;
    gradientFrom?: string;
    gradientTo?: string;
    gradient?: string;
    image?: string;
}

interface PrizePoolProps {
    title?: string;
    description?: RichTextValue;
    prizes?: PrizeData[];
}

const DEFAULT_PRIZES: PrizeData[] = [
    {
        _key: "winner",
        title: "Winner",
        amount: "रु. 60,000 Worth",
        gradient: "bg-gradient-to-t from-[#F7DF1E] to-[#FFF394]",
        image: "/icons/1st.png",
    },
    {
        _key: "second",
        title: "Second",
        amount: "रु. 30,000 Worth",
        gradient: "bg-gradient-to-t from-[#F8981D] to-[#FFD39B]",
        image: "/icons/2nd.png",
    },
    {
        _key: "third",
        title: "Third",
        amount: "रु. 10,000 Worth",
        gradient: "bg-gradient-to-t from-blue-500 to-blue-300",
        image: "/icons/3rd.png",
    },
    {
        _key: "participants",
        title: "All Participants",
        description: "Exciting Prizes & Gift Hampers",
        gradient: "bg-gradient-to-t from-[#7852FA] to-[#BDAAFF]",
        image: "/icons/stickers.png",
    },
];

export function PrizePool({ title, description, prizes }: PrizePoolProps) {
    const items = prizes && prizes.length > 0 ? prizes : DEFAULT_PRIZES;

    return (
        <GridWrapper className="before:hidden">
            <div className="py-8 space-y-8 -mt-16">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
                        {title || "Prizes & Rewards"}
                    </h2>
                    <div className="text-base md:text-lg text-text-secondary">
                        {description ? (
                            <PortableTextContent value={description} />
                        ) : (
                            <p>Compete for exciting prizes worth over NRs. 1,00,000 and amazing gift hampers</p>
                        )}
                    </div>
                </div>

                <div className="grid select-none grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-px">
                    {items.map((prize) => {
                        const gradient = prize.gradientFrom && prize.gradientTo
                            ? `linear-gradient(to top, ${prize.gradientFrom}, ${prize.gradientTo})`
                            : undefined;
                        const iconSrc = prize.icon?.asset
                            ? urlFor(prize.icon).width(200).height(200).url()
                            : prize.image;

                        return (
                            <div
                                key={prize._key}
                                className={`${prize.gradient ?? ""} p-4 md:p-8 rounded-square flex flex-col items-center justify-center gap-2 md:gap-4 aspect-square cursor-pointer h-full`}
                                style={gradient ? { background: gradient } : {}}
                            >
                                <div className="relative w-24 h-24 flex items-center justify-center">
                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                                        <rect
                                            x="5" y="5" width="90" height="90"
                                            fill="none" stroke="black" strokeWidth="2"
                                            strokeDasharray="4 4" opacity="0.3"
                                        />
                                    </svg>
                                    <div className="relative select-none z-10 flex items-center justify-center w-full h-full">
                                        {iconSrc ? (
                                            <Image
                                                src={iconSrc}
                                                alt={prize.title}
                                                width={100}
                                                height={100}
                                                className="object-contain"
                                                draggable={false}
                                                style={{ userSelect: "none" }}
                                            />
                                        ) : null}
                                    </div>
                                </div>
                                <p className="text-lg font-semibold text-black text-center">{prize.title}</p>
                                {prize.amount ? (
                                    <p className="text-base font-bold text-black">{prize.amount}</p>
                                ) : (
                                    <p className="text-sm font-bold text-black text-center">{prize.description}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </GridWrapper>
    );
}
