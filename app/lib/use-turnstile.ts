"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Turnstile = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

function getTurnstile(): Turnstile | undefined {
  return typeof window !== "undefined"
    ? (window as unknown as { turnstile?: Turnstile }).turnstile
    : undefined;
}

/**
 * Loads Cloudflare Turnstile and renders the challenge into `containerRef`.
 * `token` is set once the visitor passes; call `reset` after a successful
 * submit to clear it and show a fresh challenge.
 */
export function useTurnstile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      const turnstile = getTurnstile();
      const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;
      if (!containerRef.current || !turnstile || !siteKey) return;
      widgetIdRef.current = turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "light",
        callback: (value: string) => setToken(value),
        "error-callback": () => setToken(null),
        "expired-callback": () => setToken(null),
      });
    };

    return () => {
      const turnstile = getTurnstile();
      if (widgetIdRef.current && turnstile) {
        turnstile.remove(widgetIdRef.current);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const reset = useCallback(() => {
    setToken(null);
    const turnstile = getTurnstile();
    if (widgetIdRef.current && turnstile) {
      turnstile.reset(widgetIdRef.current);
    }
  }, []);

  return { containerRef, token, reset };
}
