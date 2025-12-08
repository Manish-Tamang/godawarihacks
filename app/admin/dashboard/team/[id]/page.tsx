import { requireAdmin } from "@/app/lib/supabase/auth-helpers";
import { createClient } from "@/app/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { generateBlurDataURL } from "@/app/lib/utils";

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
    payment_screenshot_url: string | null;
    payment_verified: boolean | null;
    team_members: TeamMember[];
}

async function getTeamById(teamId: string): Promise<Team | null> {
    const supabase = await createClient();

    const { data: team, error } = await supabase
        .from("teams")
        .select(`
      *,
      team_members (*)
    `)
        .eq("id", teamId)
        .single();

    if (error) {
        console.error("Error fetching team:", error);
        return null;
    }

    return team as Team;
}

const blurDataURL = generateBlurDataURL();

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-400", label: "Pending Review" },
    approved: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400", label: "Approved" },
    rejected: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400", label: "Rejected" },
    cancelled: { bg: "bg-gray-50 dark:bg-gray-900/20", text: "text-gray-700 dark:text-gray-400", label: "Cancelled" },
};

export default async function TeamDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = await params;
    await requireAdmin();
    const team = await getTeamById(resolvedParams.id);

    if (!team) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Team not found</h1>
                    <Link href="/admin/dashboard" className="text-[#084750] hover:underline">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const statusStyle = statusStyles[team.status];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
            {/* Header */}
            <header className="bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800">
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin/dashboard"
                                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{team.team_name}</h1>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Registered on {new Date(team.registration_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                                </p>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.label}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Team Members */}
                <div className="bg-white dark:bg-neutral-950 rounded-lg border border-gray-200 dark:border-neutral-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-800">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Team Members ({team.team_members.length})
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-neutral-800">
                        {team.team_members
                            .sort((a, b) => a.member_number - b.member_number)
                            .map((member) => (
                                <div key={member.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[#084750] text-white text-sm font-semibold">
                                                    {member.member_number}
                                                </span>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {member.full_name}
                                                </h3>
                                            </div>
                                            <div className="space-y-1 text-sm">
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">Email:</span> {member.email}
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">Phone:</span> {member.phone}
                                                </p>
                                            </div>
                                        </div>

                                        {member.document_url && (
                                            <a
                                                href={member.document_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-[#084750] text-white rounded-lg hover:bg-[#084750]/90 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                View Document
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Payment Information */}
                {team.payment_screenshot_url && (
                    <div className="mt-8 bg-white dark:bg-neutral-950 rounded-lg border border-gray-200 dark:border-neutral-800 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h3>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <Image
                                    src={team.payment_screenshot_url}
                                    alt="Payment Screenshot"
                                    width={300}
                                    height={400}
                                    className="rounded-lg border border-gray-200 dark:border-neutral-800 object-cover"
                                    placeholder="blur"
                                    blurDataURL={blurDataURL}
                                />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                                    <div className="mt-1">
                                        {team.payment_verified ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                                Pending Verification
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <a
                                        href={team.payment_screenshot_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#084750] text-white rounded-lg hover:bg-[#084750]/90 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        View Full Size
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Additional Info */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Registration Details */}
                    <div className="bg-white dark:bg-neutral-950 rounded-lg border border-gray-200 dark:border-neutral-800 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Registration Details</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Team ID</p>
                                <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{team.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Registration Date</p>
                                <p className="text-sm text-gray-900 dark:text-white">
                                    {new Date(team.registration_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Current Status</p>
                                <p className={`text-sm font-medium ${statusStyle.text}`}>{statusStyle.label}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white dark:bg-neutral-950 rounded-lg border border-gray-200 dark:border-neutral-800 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Summary</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Members</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{team.team_members.length}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Documents Submitted</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {team.team_members.filter((m) => m.document_url).length}/{team.team_members.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
