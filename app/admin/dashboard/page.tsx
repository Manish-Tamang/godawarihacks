import { GridWrapper } from "@/app/components/GridWrapper";
import { AnimatedText } from "@/app/components/AnimatedText";
import { requireAdmin } from "@/app/lib/supabase/auth-helpers";
import { createClient } from "@/app/lib/supabase/server";
import { SignOutButton } from "@/app/components/admin/SignOutButton";
import { DashboardClient } from "@/app/components/admin/DashboardClient";

interface TeamMember {
  id: string;
  member_number: number;
  full_name: string;
  email: string;
  phone: string;
  document_type: string;
  document_url: string;
  created_at: string;
}

interface Team {
  id: string;
  team_name: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  registration_date: string;
  created_at: string;
  team_members: TeamMember[];
}

async function getTeams(): Promise<Team[]> {
  const supabase = await createClient();

  const { data: teams, error } = await supabase
    .from("teams")
    .select(`
      *,
      team_members (*)
    `)
    .order("registration_date", { ascending: false });

  if (error) {
    console.error("Error fetching teams:", error);
    return [];
  }

  return (teams || []) as Team[];
}

export default async function AdminDashboardPage() {
  // Require admin authentication
  const adminUser = await requireAdmin();
  const teams = await getTeams();

  const HEADING_DELAY = 0.2;
  const PARAGRAPH_DELAY = HEADING_DELAY + 0.1;

  const stats = {
    total: teams.length,
    pending: teams.filter((t) => t.status === "pending").length,
    approved: teams.filter((t) => t.status === "approved").length,
    rejected: teams.filter((t) => t.status === "rejected").length,
  };

  return (
    <section className="mt-6 space-y-10 md:mt-0 md:space-y-16 pb-0">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-blue-50/30 to-transparent -z-10"></div>
        <div
          className="absolute inset-0 opacity-[0.03] -z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23007cff' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="relative text-balance">
          <AnimatedText
            as="h1"
            delay={HEADING_DELAY}
            className="mx-auto max-w-2xl text-center text-6xl font-bold leading-tight tracking-tighter text-blue-600 md:text-8xl md:leading-[78px]"
          >
            Admin Dashboard
          </AnimatedText>
          <div className="mt-4 text-center md:mt-8">
            <AnimatedText
              as="p"
              delay={PARAGRAPH_DELAY}
              className="leading-8 text-text-secondary text-base md:text-lg max-w-3xl mx-auto"
            >
              Welcome back, {adminUser.full_name || adminUser.email}. Manage team registrations and review submissions.
            </AnimatedText>
            <div className="mt-4">
              <SignOutButton />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative space-y-10 md:space-y-16">
        <GridWrapper>
          <div className="py-8 md:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
              <div className="p-6 border border-border-primary/50 rounded-square bg-bg-primary">
                <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-text-secondary mt-1">Total Teams</div>
              </div>
              <div className="p-6 border border-border-primary/50 rounded-square bg-bg-primary">
                <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-text-secondary mt-1">Pending</div>
              </div>
              <div className="p-6 border border-border-primary/50 rounded-square bg-bg-primary">
                <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
                <div className="text-sm text-text-secondary mt-1">Approved</div>
              </div>
              <div className="p-6 border border-border-primary/50 rounded-square bg-bg-primary">
                <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-sm text-text-secondary mt-1">Rejected</div>
              </div>
            </div>
          </div>
        </GridWrapper>
      </section>

      {/* Teams List Section */}
      <section className="relative space-y-10 md:space-y-16">
        <GridWrapper>
          <div className="py-8 md:py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4">
              <h2 className="text-blue-600 text-balance text-left text-3xl font-medium leading-10 tracking-tight md:text-4xl">
                Team Registrations
              </h2>
              <div className="mt-4 md:mt-0 text-sm text-text-secondary">
                Total: {teams.length} team{teams.length !== 1 ? "s" : ""}
              </div>
            </div>

            <DashboardClient teams={teams} />
          </div>
        </GridWrapper>
      </section>
    </section>
  );
}

