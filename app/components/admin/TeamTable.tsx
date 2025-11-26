"use client";

import { useState } from "react";
import { DocumentViewer } from "./DocumentViewer";

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

interface TeamTableProps {
  teams: Team[];
  onStatusUpdate: (teamId: string, newStatus: Team["status"]) => Promise<void>;
}

export function TeamTable({ teams, onStatusUpdate }: TeamTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    type: string;
    memberName: string;
  } | null>(null);
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

  const handleStatusChange = async (
    teamId: string,
    newStatus: Team["status"]
  ) => {
    setUpdatingStatus(teamId);
    try {
      await onStatusUpdate(teamId, newStatus);
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <>
      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by team name, member name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-text-secondary">
            Found {filteredTeams.length} team{filteredTeams.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="px-4 overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border-primary bg-bg-secondary/30">
                <th className="text-left py-4 px-4 text-sm font-semibold text-text-primary sticky left-0 bg-bg-secondary/30 z-10">
                  Team Name
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-text-primary min-w-[300px]">
                  Members
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-text-primary whitespace-nowrap">
                  Registration Date
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-text-primary whitespace-nowrap">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-text-primary whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-secondary">
                    {searchQuery
                      ? "No teams found matching your search."
                      : "No team registrations yet."}
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team) => (
                  <tr
                    key={team.id}
                    className="border-b border-border-primary/50 hover:bg-bg-secondary/30 transition-colors"
                  >
                    <td className="py-4 px-4 sticky left-0 bg-bg-primary z-10">
                      <div className="font-semibold text-text-primary">
                        {team.team_name}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-3 min-w-[280px]">
                        {team.team_members
                          .sort((a, b) => a.member_number - b.member_number)
                          .map((member) => (
                            <div
                              key={member.id}
                              className="text-sm border-l-2 border-blue-600/30 pl-3 space-y-1"
                            >
                              <div className="font-medium text-text-primary flex items-center gap-2">
                                <span className="text-xs text-text-secondary">#{member.member_number}</span>
                                {member.full_name}
                              </div>
                              <div className="text-xs text-text-secondary">{member.email}</div>
                              <div className="text-xs text-text-secondary">{member.phone}</div>
                              {member.document_url && (
                                <button
                                  onClick={() =>
                                    setSelectedDocument({
                                      url: member.document_url,
                                      type: member.document_type,
                                      memberName: member.full_name,
                                    })
                                  }
                                  className="text-xs text-blue-600 hover:text-blue-700 underline mt-1 flex items-center gap-1"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  View Document
                                </button>
                              )}
                            </div>
                          ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-text-secondary whitespace-nowrap">
                      {new Date(team.registration_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-square text-xs font-medium ${
                          team.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : team.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : team.status === "cancelled"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={team.status}
                        onChange={(e) =>
                          handleStatusChange(
                            team.id,
                            e.target.value as Team["status"]
                          )
                        }
                        disabled={updatingStatus === team.id}
                        className="px-3 py-2 text-sm border border-border-primary rounded-square bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updatingStatus === team.id && (
                        <span className="ml-2 text-xs text-text-secondary">Updating...</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          url={selectedDocument.url}
          type={selectedDocument.type}
          memberName={selectedDocument.memberName}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </>
  );
}

