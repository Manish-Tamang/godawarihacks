import { GridWrapper } from "./GridWrapper";
import Image from "next/image";

const prizes = [
    {
        title: "Winner",
        amount: "रु. 60,000 Worth",
        gradient: "bg-gradient-to-t from-[#F7DF1E] to-[#FFF394]",
        image: "/icons/1st.png",
    },
    {
        title: "Second",
        amount: "रु. 30,000 Worth",
        gradient: "bg-gradient-to-t from-[#F8981D] to-[#FFD39B]",
        image: "/icons/2nd.png",
    },
    {
        title: "Third",
        amount: "रु. 10,000 Worth",
        gradient: "bg-gradient-to-t from-blue-500 to-blue-300",
        image: "/icons/3rd.png",
    },
    {
        title: "All Participants",
        description: "Coding Stickers",
        gradient: "bg-gradient-to-t from-[#7852FA] to-[#BDAAFF]",
        image: "/icons/stickers.png",
    },
];

export function PrizePool() {
    return (
        <GridWrapper className="before:hidden">
            <div className="py-8 space-y-8 -mt-16">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
                        Prizes & Rewards
                    </h2>
                    <div className="space-y-2">
                        <p className="text-base md:text-lg text-text-secondary">
                            Compete for exciting prizes worth over NRs. 1,00,000 and amazing gift hampers
                        </p>
                    </div>
                </div>


                <div className="grid select-none grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-px">
                    {prizes.map((prize, index) => (
                        <div
                            key={prize.title}
                            className={`${prize.gradient} p-4 md:p-8 rounded-square flex flex-col items-center justify-center gap-2 md:gap-4 aspect-square cursor-pointer h-full`}
                        >
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                                    <rect
                                        x="5"
                                        y="5"
                                        width="90"
                                        height="90"
                                        fill="none"
                                        stroke="black"
                                        strokeWidth="2"
                                        strokeDasharray="4 4"
                                        opacity="0.3"
                                    />
                                </svg>
                                <div className="relative select-none z-10 flex items-center justify-center w-full h-full">
                                    {prize.image ? (
                                        <Image
                                            src={prize.image}
                                            alt={prize.title}
                                            width={100}
                                            height={100}
                                            className="object-contain"
                                            draggable={false}
                                            style={{ userSelect: 'none' }}
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
                    ))}
                </div>
            </div>
        </GridWrapper>
    );
}

