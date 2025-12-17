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

interface MemberDocumentsProps {
    members: TeamMember[];
}

export function MemberDocuments({ members }: MemberDocumentsProps) {
    const [activeDoc, setActiveDoc] = useState<
        | { url: string; type: string; memberName: string }
        | null
    >(null);

    return (
        <div className="divide-y divide-gray-200 dark:divide-neutral-800">
            {members
                .sort((a, b) => a.member_number - b.member_number)
                .map((member) => (
                    <div
                        key={member.id}
                        className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors"
                    >
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
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveDoc({
                                            url: member.document_url,
                                            type: member.document_type,
                                            memberName: member.full_name,
                                        })
                                    }
                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-[#084750] text-white rounded-lg hover:bg-[#084750]/90 transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    View Document
                                </button>
                            )}
                        </div>
                    </div>
                ))}

            {activeDoc && (
                <DocumentViewer
                    url={activeDoc.url}
                    type={activeDoc.type}
                    memberName={activeDoc.memberName}
                    onClose={() => setActiveDoc(null)}
                />
            )}
        </div>
    );
}
