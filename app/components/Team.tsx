"use client";

import { GridWrapper } from "./GridWrapper";
import { motion } from "framer-motion";
import Image from "next/image";

interface TeamMember {
  name: string;
  role: string;
  faculty?: string;
  image?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Raj Acharya",
    role: "Event Organizer",
    faculty: "Management (Computer)",
    image: "/team/raj.jpg",
  },
  {
    name: "Manish Tamang",
    role: "Event Organizer",
    faculty: "Science",
    image: "/gole.jpg",
  },
  {
    name: "Bipan Deuja",
    role: "Technical Lead",
    faculty: "Science",
    image: "/team/bipan.png",
  },
  {
    name: "Ganesh Shah",
    role: "Event Lead",
    faculty: "Management (Computer)",
    image: "/team/ganesh.png",
  },
  {
    name: "Abhi Karki",
    role: "Event Manager, Connect Club",
    faculty: "Science",
    image: "/team/abhi.png",
  },
];

export function Team() {
  return (
    <div className="relative -mt-10">
      <div className="relative z-10">
        <GridWrapper>
          <div className="text-center py-8 md:py-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Meet the team
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
              The students behind the scenes making this event possible, from organizing to managing to technical support.
            </p>
          </div>
        </GridWrapper>
        <GridWrapper className="before:hidden">
          <div className="relative py-12 md:py-16 -mt-16">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-px w-full">
              {teamMembers.map((member) => (
                <motion.div
                  key={member.name}
                  className="relative aspect-square overflow-hidden rounded-square w-full"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={member.image || "/team/gole.jpg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-gray-200 text-sm">
                        {member.role}
                        {member.faculty && `, ${member.faculty}`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GridWrapper>
      </div>
    </div>
  );
}

