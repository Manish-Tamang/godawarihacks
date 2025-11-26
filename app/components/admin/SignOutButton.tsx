"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const response = await fetch("/api/admin/signout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/admin/signin");
        router.refresh();
      }
    } catch (error) {
      console.error("Sign-out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-border-primary rounded-square hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSigningOut ? "Signing out..." : "Sign Out"}
    </button>
  );
}

