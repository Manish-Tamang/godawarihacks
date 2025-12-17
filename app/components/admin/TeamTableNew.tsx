"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { Listbox, Transition, Dialog } from "@headlessui/react";
import toast from "react-hot-toast";

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
    onDeleteTeam: (teamId: string) => Promise<void>;
}

const statusStyles: Record<string, { bg: string; text: string }> = {
    approved: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400" },
    rejected: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400" },
    cancelled: { bg: "bg-gray-50 dark:bg-gray-900/20", text: "text-gray-700 dark:text-gray-400" },
    pending: { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-400" },
};

export function TeamTable({ teams, onStatusUpdate, onDeleteTeam }: TeamTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState<string | null>(null);
    const statusOptions: Team["status"][] = [
        "pending",
        "approved",
        "rejected",
        "cancelled",
    ];

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
            await toast.promise(onStatusUpdate(teamId, newStatus), {
                loading: "Updating status...",
                success: "Status updated",
                error: (e) => e?.message || "Failed to update",
            });
        } finally {
            setUpdatingStatus(null);
        }
    };

    const openDeleteConfirm = (teamId: string) => {
        setToDeleteId(teamId);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!toDeleteId) return;
        try {
            await toast.promise(onDeleteTeam(toDeleteId), {
                loading: "Deleting team...",
                success: "Team deleted",
                error: (e) => e?.message || "Failed to delete",
            });
        } finally {
            setConfirmOpen(false);
            setToDeleteId(null);
        }
    };

    return (
        <div className="p-6 bg-white">
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by team name, member name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-10 border border-border-primary/50 rounded-square bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-[#084750] focus:border-transparent"
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
            <div>
                {filteredTeams.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">
                            {searchQuery ? "No teams found matching your search." : "No team registrations yet."}
                        </p>
                    </div>
                ) : (
                    <div className="border border-border-primary/50 rounded-square divide-y divide-border-primary/50 overflow-visible">
                        {filteredTeams.map((team) => (
                            <div key={team.id} className="group p-4 bg-white relative">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    {/* Team Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-foreground group-hover:text-[#084750] transition-colors truncate">
                                                {team.team_name}
                                            </h3>
                                            <span className="text-sm text-muted-foreground flex-shrink-0">
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
                                            <span className="text-muted-foreground">
                                                <span className="font-medium">Registered:</span>{" "}
                                                {new Date(team.registration_date).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                            <span className="text-muted-foreground">
                                                <span className="font-medium">Documents:</span>{" "}
                                                {team.team_members.filter((m) => m.document_url).length}/{team.team_members.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0">
                                        {/* View */}
                                        <Link
                                            href={`/admin/dashboard/team/${team.id}`}
                                            className="inline-flex items-center px-3 py-2 text-sm border border-border-primary/50 rounded-square hover:bg-muted/40 text-foreground"
                                        >
                                            View
                                        </Link>

                                        {/* Status dropdown (HeadlessUI Listbox) */}
                                        <div className="relative min-w-[160px]">
                                            <Listbox
                                                value={team.status}
                                                onChange={(value: Team["status"]) => handleStatusChange(team.id, value)}
                                                disabled={updatingStatus === team.id}
                                            >
                                                {({ open }) => (
                                                    <div className="relative">
                                                        <Listbox.Button
                                                            className={`w-full px-3 py-2 text-left text-sm border rounded-square ${statusStyles[team.status].bg} ${statusStyles[team.status].text} border-current focus:outline-none focus:ring-2 focus:ring-[#084750] disabled:opacity-50`}
                                                        >
                                                            <span className="block truncate capitalize">{team.status}</span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                                                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.187l3.71-3.957a.75.75 0 011.08 1.04l-4.25 4.53a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
                                                                </svg>
                                                            </span>
                                                        </Listbox.Button>
                                                        <Transition
                                                            as={Fragment}
                                                            show={open}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options className="absolute z-20 mt-1 w-full max-h-60 overflow-auto rounded-square border border-border-primary/50 bg-bg-primary focus:outline-none shadow-sm">
                                                                {statusOptions.map((status) => (
                                                                    <Listbox.Option
                                                                        key={status}
                                                                        value={status}
                                                                        className={({ active }) => `cursor-pointer select-none px-3 py-2 text-sm capitalize ${active ? "bg-muted" : ""}`}
                                                                    >
                                                                        {status}
                                                                    </Listbox.Option>
                                                                ))}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                )}
                                            </Listbox>
                                        </div>

                                        {/* Delete */}
                                        <button
                                            type="button"
                                            onClick={() => openDeleteConfirm(team.id)}
                                            className="inline-flex items-center px-3 py-2 text-sm border border-red-300 text-red-600 rounded-square hover:bg-red-50 dark:hover:bg-red-900/10"
                                        >
                                            Delete
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirm Delete Modal */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} className="relative z-40">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-sm rounded-square border border-border-primary/50 bg-bg-primary p-5">
                        <Dialog.Title className="text-lg font-medium text-foreground">Delete team?</Dialog.Title>
                        <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                            This action cannot be undone. The team and its members will be removed.
                        </Dialog.Description>
                        <div className="mt-5 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmOpen(false)}
                                className="px-3 py-2 text-sm border border-border-primary/50 rounded-square hover:bg-muted/40"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-square hover:bg-red-50 dark:hover:bg-red-900/10"
                            >
                                Delete
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
