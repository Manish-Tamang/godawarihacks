"use client";

import { FeedbackFish } from "@feedback-fish/react";

/** Floating "Report Issue" button that opens the Feedback Fish widget. */
export function FeedbackButton() {
  return (
    <FeedbackFish
      projectId={process.env.NEXT_PUBLIC_PROJECTID || "1eaa7bd2353b27"}
    >
      <button
        className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-black bg-black px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-200"
        aria-label="Report an issue or send feedback"
      >
        <svg
          className="size-4 transition-transform group-hover:rotate-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span className="hidden sm:inline">Report Issue</span>
      </button>
    </FeedbackFish>
  );
}
