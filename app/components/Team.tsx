import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { SectionHeading } from "./ui/section-heading";
import { SplitHeading } from "./ui/split-heading";
import { CellGrid } from "./ui/cell-grid";

interface TeamMemberData {
  _id: string;
  name: string;
  role?: string | null;
  faculty?: string | null;
  image?: {
    asset?: { _id: string; url: string; metadata?: { lqip?: string } };
    alt?: string;
  } | null;
}

interface TeamProps {
  title?: string;
  description?: string;
  members?: TeamMemberData[];
  /**
   * `centered`: centred heading over a hairline grid (homepage).
   * `split`: heading beside its description over an open grid (about page).
   */
  layout?: "centered" | "split";
}

/**
 * Heading plus a grid of member cards. Renders no outer band so the page
 * decides which `GridSection` it sits in.
 */
export function Team({
  title = "Meet the team",
  description = "The students behind the scenes making this event possible, from organizing to managing to technical support.",
  members,
  layout = "centered",
}: TeamProps) {
  const team = members ?? [];

  if (layout === "split") {
    return (
      <div className="px-5 pb-14 pt-24">
        <SplitHeading title={title}>
          {description ? <p>{description}</p> : null}
        </SplitHeading>
        {team.length > 0 && (
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-12">
            {team.map((member) => (
              <MemberCard key={member._id} member={member} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <SectionHeading
        align="center"
        className="px-4"
        title={title}
        description={<p>{description}</p>}
      />
      {team.length > 0 && (
        <div className="mt-12 border-t border-grid-border">
          <CellGrid className="grid-cols-2 md:grid-cols-4">
            {team.map((member) => (
              <div key={member._id} className="bg-white p-3 sm:p-5">
                <MemberCard member={member} />
              </div>
            ))}
          </CellGrid>
        </div>
      )}
    </div>
  );
}

function MemberCard({ member }: { member: TeamMemberData }) {
  const imageSrc = member.image?.asset
    ? urlFor(member.image).width(600).height(600).url()
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={member.image?.alt || member.name}
            fill
            placeholder={
              member.image?.asset?.metadata?.lqip ? "blur" : undefined
            }
            blurDataURL={member.image?.asset?.metadata?.lqip}
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 270px"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="font-display text-3xl font-medium text-neutral-400">
              {member.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/5" />
      </div>
      <div className="flex flex-col">
        <h3 className="text-sm font-medium leading-normal text-neutral-900">
          {member.name}
        </h3>
        {(member.role || member.faculty) && (
          <p className="text-xs leading-normal text-neutral-500">
            {[member.role, member.faculty].filter(Boolean).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
