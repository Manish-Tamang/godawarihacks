"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TeamTable } from "./TeamTableNew";

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

            // Show success message (optional - you can add a toast notification here)
        } catch (error) {
            console.error("Error updating status:", error);
            alert(error instanceof Error ? error.message : "Failed to update status");
            // Refresh to get latest data
            router.refresh();
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-bg-primary border border-border-primary/50 rounded-square overflow-hidden">
            <TeamTable teams={teams} onStatusUpdate={handleStatusUpdate} />
        </div>
    );
}

