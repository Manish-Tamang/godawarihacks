"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TeamTable } from "./TeamTableNew";
import { Toaster, toast } from "react-hot-toast";

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

interface DashboardClientProps {
    teams: Team[];
}

export function DashboardClient({ teams: initialTeams }: DashboardClientProps) {
    const [teams, setTeams] = useState<Team[]>(initialTeams);
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const handleStatusUpdate = async (
        teamId: string,
        newStatus: Team["status"]
    ) => {
        setIsUpdating(true);
        try {
            const response = await fetch("/api/admin/update-team-status", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ teamId, status: newStatus }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update status");
            }

            // Update local state
            setTeams((prevTeams) =>
                prevTeams.map((team) =>
                    team.id === teamId ? { ...team, status: newStatus } : team
                )
            );
            toast.success("Status updated");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to update status"
            );
            // Refresh to get latest data
            router.refresh();
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteTeam = async (teamId: string) => {
        setIsUpdating(true);
        try {
            const response = await fetch("/api/admin/delete-team", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teamId }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || "Failed to delete team");
            }

            setTeams((prev) => prev.filter((t) => t.id !== teamId));
            toast.success("Team deleted");
        } catch (error) {
            console.error("Error deleting team:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to delete team"
            );
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-bg-primary border border-border-primary/50 rounded-square overflow-hidden">
            <Toaster position="top-center" />
            <TeamTable
                teams={teams}
                onStatusUpdate={handleStatusUpdate}
                onDeleteTeam={handleDeleteTeam}
            />
        </div>
    );
}

