'use client';

import { useState, useEffect } from 'react';

export function ApologyBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const bannerDismissed = sessionStorage.getItem('prizePoolBannerDismissed');
        if (!bannerDismissed) {
            setTimeout(() => setIsVisible(true), 1000);
        }
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('prizePoolBannerDismissed', 'true');
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'
                    }`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className={`relative bg-white dark:bg-neutral-800 rounded-lg shadow-2xl max-w-2xl w-full transition-all duration-300 ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                        }`}
                >
                    {/* Header */}
                    <div className="bg-[#09555E] text-white px-6 py-4 rounded-t-lg">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <svg
                                    className="w-6 h-6 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <h3 className="text-xl font-bold">Important Notice: Prize Pool Clarification</h3>
                            </div>

                            <button
                                onClick={handleClose}
                                className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
                                aria-label="Close modal"
                            >
                                <svg
                                    className="w-6 h-6"
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
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 space-y-4 text-neutral-800 dark:text-neutral-200">
                        <p className="text-base leading-relaxed">
                            We sincerely apologize for the confusion regarding yesterday's prize pool announcement.
                            We understand this change caused frustration among our participants.
                        </p>

                        <div className="bg-[#09555E]/10 border-l-4 border-[#09555E] rounded-r-lg p-4 space-y-3">
                            <p className="font-semibold">📢 Important Clarification:</p>
                            <ul className="space-y-2 ml-4 text-sm">
                                <li>• <strong>रु20,000</strong> for 1st place is the <strong>IN-PERSON CASH PRIZE</strong></li>
                                <li>• <strong>रु10,000</strong> for 2nd place is the <strong>IN-PERSON CASH PRIZE</strong></li>
                                <li>• <strong>रु5,000</strong> for 3rd place is the <strong>IN-PERSON CASH PRIZE</strong></li>
                            </ul>
                            <p className="mt-3 font-medium text-sm">
                                🎁 Additional prizes will be provided to reach the total <strong>WORTH</strong> displayed in our prize pool section (₹60,000, ₹30,000, and ₹10,000 respectively).
                            </p>
                        </div>

                        <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-4">
                            <p className="text-sm leading-relaxed">
                                <strong>Our Sincere Apology:</strong> We acknowledge this was our mistake in communication.
                                The prize pool section clearly mentions "worth" but not specifically "cash prize."
                                We appreciate your understanding and encourage all participants to reach out to the
                                organizing team directly with any concerns rather than venting to others.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900 rounded-b-lg">
                        <button
                            onClick={handleClose}
                            className="w-full bg-[#09555E] hover:bg-[#084750] text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            I Understand
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
