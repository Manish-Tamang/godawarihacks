"use client";

import { useEffect } from "react";
import Image from "next/image";

interface DocumentViewerProps {
    url: string;
    type: string;
    memberName: string;
    onClose: () => void;
}

export function DocumentViewer({
    url,
    type,
    memberName,
    onClose,
}: DocumentViewerProps) {
    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = "hidden";

        // Close on ESC key
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "unset";
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    const fileExtension = url.split(".").pop()?.toLowerCase();
    const isPDF = fileExtension === "pdf" || url.includes(".pdf");
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "");

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative max-w-4xl max-h-[90vh] w-full mx-4 bg-bg-primary rounded-square shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border-primary">
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">
                            Document: {memberName}
                        </h3>
                        <p className="text-sm text-text-secondary mt-1">
                            Type: {type.charAt(0).toUpperCase() + type.slice(1)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-bg-secondary rounded-square transition-colors"
                        aria-label="Close"
                    >
                        <svg
                            className="w-6 h-6 text-text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
                    {isPDF ? (
                        <iframe
                            src={url}
                            className="w-full h-[calc(90vh-120px)] border border-border-primary rounded-square"
                            title={`Document for ${memberName}`}
                        />
                    ) : (
                        <div className="flex items-center justify-center">
                            <Image
                                src={url}
                                alt={`Document for ${memberName}`}
                                width={1200}
                                height={900}
                                className="max-w-full max-h-[calc(90vh-120px)] object-contain rounded-square"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/placeholder-image.png";
                                    target.alt = "Failed to load image";
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-border-primary">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                        Open in new tab
                    </a>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-square hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

