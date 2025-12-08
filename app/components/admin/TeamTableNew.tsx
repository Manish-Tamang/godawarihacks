"use client";

import { useState } from "react";
import Link from "next/link";

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
    payment_verified: boolean | null;
    team_members: TeamMember[];
}

interface TeamTableProps {
    teams: Team[];
    onStatusUpdate: (teamId: string, newStatus: Team["status"]) => Promise<void>;
}

const statusStyles: Record<string, { bg: string; text: string }> = {
    approved: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400" },
    rejected: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400" },
    cancelled: { bg: "bg-gray-50 dark:bg-gray-900/20", text: "text-gray-700 dark:text-gray-400" },
    pending: { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-400" },
};

export function TeamTable({ teams, onStatusUpdate }: TeamTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    const filteredTeams = teams.filter((team) => {
        const query = searchQuery.toLowerCase();
        return (
            team.team_name.toLowerCase().includes(query) ||
            team.team_members.some((member) =>
                member.full_name.toLowerCase().includes(query) ||
                member.email.toLowerCase().includes(query) ||
                member.phone.includes(query)
            )
        );
    });

    const handleStatusChange = async (teamId: string, newStatus: Team["status"]) => {
        setUpdatingStatus(teamId);
        try {
            await onStatusUpdate(teamId, newStatus);
        } finally {
            setUpdatingStatus(null);
        }
    };

    return (
        <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by team name, member name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent transition-colors"
                    />
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                {searchQuery && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Found {filteredTeams.length} team{filteredTeams.length !== 1 ? "s" : ""}
                    </p>
                )}
            </div>

            {/* Teams List */}
            <div className="space-y-3">
                {filteredTeams.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchQuery ? "No teams found matching your search." : "No team registrations yet."}
                        </p>
                    </div>
                ) : (
                    filteredTeams.map((team) => (
                        <Link key={team.id} href={`/admin/dashboard/team/${team.id}`}>
                            <div className="group p-4 bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-lg hover:border-[#084750] dark:hover:border-[#084750] hover:shadow-md transition-all cursor-pointer">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    {/* Team Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#084750] transition-colors truncate">
                                                {team.team_name}
                                            </h3>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                                                {team.team_members.length} member{team.team_members.length !== 1 ? "s" : ""}
                                            </span>
                                            {team.payment_verified && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 flex-shrink-0">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Paid
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Registered:</span>{" "}
                                                {new Date(team.registration_date).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Documents:</span>{" "}
                                                {team.team_members.filter((m) => m.document_url).length}/{team.team_members.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status and Actions */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0">
                                        <select
                                            value={team.status}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange(team.id, e.target.value as Team["status"]);
                                            }}
                                            disabled={updatingStatus === team.id}
                                            className={`px-3 py-2 text-sm border rounded-lg font-medium transition-colors ${statusStyles[team.status].bg
                                                } ${statusStyles[team.status].text} border-current focus:outline-none focus:ring-2 focus:ring-[#084750] disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        {updatingStatus === team.id && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Updating...</span>
                                        )}
                                        <div className="text-gray-400 group-hover:text-[#084750] transition-colors flex-shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
