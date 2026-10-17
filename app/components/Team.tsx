import { GridWrapper } from "./GridWrapper";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface TeamMemberData {
  _id: string;
  name: string;
  role: string;
  faculty?: string;
  image?: {
    asset?: { _id: string; url: string; metadata?: { lqip?: string } };
    alt?: string;
  } | null;
}

interface TeamProps {
  title?: string;
  description?: string;
  members?: TeamMemberData[];
}

export function Team({
  title = "Meet the team",
  description = "The students behind the scenes making this event possible, from organizing to managing to technical support.",
  members,
}: TeamProps) {
  const team = members ?? [];

  return (
    <div className="relative -mt-10">
      <div className="relative z-10">
        <GridWrapper>
          <div className="text-center py-8 md:py-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
              {description}
            </p>
          </div>
        </GridWrapper>
        {team.length > 0 && (
          <GridWrapper className="before:hidden">
            <div className="relative py-12 md:py-16 -mt-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-px w-full">
                {team.map((member) => {
                  const imageSrc = member.image?.asset
                    ? urlFor(member.image).width(600).height(600).url()
                    : null;
                  return (
                    <div
                      key={member._id}
                      className="relative aspect-square overflow-hidden rounded-square w-full"
                    >
                      <div className="relative w-full h-full">
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={member.image?.alt || member.name}
                            fill
                            placeholder={
                              member.image?.asset?.metadata?.lqip
                                ? "blur"
                                : undefined
                            }
                            blurDataURL={member.image?.asset?.metadata?.lqip}
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-neutral-800">
                            <span className="text-3xl font-bold text-text-tertiary">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                          <h3 className="text-xl font-semibold text-white">
                            {member.name}
                          </h3>
                          <p className="text-gray-200 text-sm">
                            {member.role}
                            {member.faculty && `, ${member.faculty}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GridWrapper>
        )}
      </div>
    </div>
  );
}
