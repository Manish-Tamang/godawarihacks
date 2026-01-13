"use client";

import { GridWrapper } from "./GridWrapper";
import { motion } from "framer-motion";
import Image from "next/image";
import { LinkedIn } from "./icons/LinkedIn";
import { GitHub } from "./icons/Github";
import { Instagram } from "./icons/Instagram";

interface TeamMember {
  name: string;
  role: string;
  faculty?: string;
  image?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Ankit Katwal",
    role: "Event Manager",
    faculty: "Science",
    image: "/team/ankit.png",
    instagram: "https://www.instagram.com/ankit_0721___/",
  },
  {
    name: "Bimarsh Katwal",
    role: "Event Lead",
    faculty: "Science",
    image: "/team/bimarsh.jpg",
  },
  {
    name: "Manish Tamang",
    role: "Event Organizer",
    faculty: "Science",
    image: "/gole.jpg",
    linkedin: "https://www.linkedin.com/in/manish-tamang/",
    github: "https://github.com/Manish-Tamang",
    instagram: "https://www.instagram.com/golecodes/",
  },
  {
    name: "Bipan Deuja",
    role: "Technical Lead",
    faculty: "Science",
    image: "/team/bipan.png",
    github: "https://github.com/bipancodes",
  },
  {
    name: "Ganesh Shah",
    role: "Event Marketing Lead",
    faculty: "Management (Computer)",
    image: "/team/ganesh.png",
    github: "https://github.com/GaneshShah98",
    instagram: "https://www.instagram.com/ganesh_sha1/",
  },
  {
    name: "Abhi Karki",
    role: "Event Manager, Connect Club",
    faculty: "Science",
    image: "/team/abhi.png",
    instagram: "https://www.instagram.com/abhi_karki09/",
  },
  {
    name: "Raj Acharya",
    role: "Event Organizer",
    faculty: "Management (Computer)",
    image: "/team/raj.jpg",
    github: "https://github.com/rajacharya987",
  },
  {
    name: "Ronisha Adhikari",
    role: "Event Host",
    faculty: "Science (Biology)",
    image: "/team/ronisha.jpg",
    instagram: "https://www.instagram.com/ah_sinorr/",
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
                  className="relative aspect-square overflow-hidden rounded-square w-full group"
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

                    {/* Social Media Icons - Show on Hover */}
                    {(member.linkedin || member.github || member.instagram) && (
                      <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                          >
                            <LinkedIn className="w-5 h-5" />
                          </a>
                        )}
                        {member.github && (
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                          >
                            <GitHub className="w-5 h-5" />
                          </a>
                        )}
                        {member.instagram && (
                          <a
                            href={member.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                          >
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    )}

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

