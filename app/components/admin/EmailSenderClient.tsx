"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export function EmailSenderClient() {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [html, setHtml] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    .container { font-family: sans-serif; padding: 20px; color: #333; }
    .header { color: #084750; border-bottom: 2px solid #084750; padding-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="header">Hello from Godawari Hacks!</h1>
    <p>This is a custom HTML email template.</p>
    <p>Feel free to edit this content.</p>
  </div>
</body>
</html>`);
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!to || !subject || !html) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSending(true);
        try {
            const response = await fetch("/api/admin/send-custom-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to, subject, html }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Email sent successfully!");
            } else {
                throw new Error(data.error || "Failed to send email");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error(error instanceof Error ? error.message : "Failed to send email");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-neutral-900">
            <Toaster position="top-right" />

            {/* Top Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-800 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Email Sender</h2>
                    <p className="text-sm text-gray-500">Design and send custom HTML emails</p>
                </div>
                <button
                    onClick={handleSend}
                    disabled={isSending}
                    className="px-6 py-2 bg-[#084750] text-white rounded-lg font-medium hover:bg-[#084750]/90 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                    {isSending ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                        </>
                    ) : (
                        "Send Email"
                    )}
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Editor Side */}
                <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-neutral-800 p-6 space-y-4 overflow-y-auto">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient Email</label>
                            <input
                                type="email"
                                placeholder="recipient@example.com"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#084750] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject Line</label>
                            <input
                                type="text"
                                placeholder="Important update about..."
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#084750] focus:border-transparent outline-none"
                            />
                        </div>
                        <div className="flex-1 min-h-[400px] flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HTML Template</label>
                            <textarea
                                value={html}
                                onChange={(e) => setHtml(e.target.value)}
                                className="flex-1 w-full p-4 font-mono text-sm border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#084750] focus:border-transparent outline-none resize-none"
                                placeholder="Paste your HTML here..."
                            />
                        </div>
                    </div>
                </div>

                {/* Preview Side */}
                <div className="w-1/2 bg-gray-50 dark:bg-neutral-950 flex flex-col">
                    <div className="px-6 py-2 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Live Preview
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-2xl mx-auto h-full min-h-[600px]">
                            <div className="bg-gray-100 p-3 border-b border-gray-200 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono flex-1 text-center truncate">
                                    {subject || "New Message"}
                                </div>
                            </div>
                            <iframe
                                title="Preview"
                                srcDoc={html}
                                className="w-full h-full border-none min-h-[600px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
