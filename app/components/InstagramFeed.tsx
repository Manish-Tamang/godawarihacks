"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { GridWrapper } from "./GridWrapper";

const STYLE_ID = "gh-instagram-feed-style";

const FEED_STYLE = `
  a[href*="elfsight.com"] {
    display: none !important;
  }
  .es-card-container,
  .es-card-media,
  .es-media-container,
  .es-media-image {
    border-radius: 4px !important;
  }
  .es-card-container {
    overflow: hidden !important;
  }
`;

function tuneFeed(root: HTMLElement) {
  const host = root.querySelector(".es-embed-root");
  const shadow = host instanceof HTMLElement ? host.shadowRoot : null;
  if (!shadow) return false;

  shadow.querySelectorAll('a[href*="elfsight.com"]').forEach((link) => {
    link.remove();
  });

  if (!shadow.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = FEED_STYLE;
    shadow.appendChild(style);
  }

  return true;
}

export function InstagramFeed() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let shadowObserver: MutationObserver | null = null;

    const attach = () => {
      if (!tuneFeed(root) || shadowObserver) return;
      const shadow = root.querySelector(".es-embed-root")?.shadowRoot;
      if (!shadow) return;
      shadowObserver = new MutationObserver(() => tuneFeed(root));
      shadowObserver.observe(shadow, { childList: true, subtree: true });
    };

    attach();
    const observer = new MutationObserver(attach);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      shadowObserver?.disconnect();
    };
  }, []);

  return (
    <div className="space-y-4 -mt-8">
      <div className="space-y-3 px-4 md:px-6">
        <h2 className="text-balance text-left text-3xl font-medium leading-10 tracking-tight text-[#084750] md:text-4xl">
          Follow us on Instagram
        </h2>
        <p className="max-w-2xl text-left leading-relaxed text-text-secondary">
          Photos, announcements, and updates from the hackathon as they happen.
        </p>
      </div>
      <GridWrapper>
        <div ref={rootRef} className="px-4 py-6 md:px-6 md:py-8">
          <Script src="https://elfsightcdn.com/platform.js" strategy="afterInteractive" />
          <div
            className="elfsight-app-1308c973-0548-4c23-b06b-0f8f4021b808 min-h-[280px]"
            data-elfsight-app-lazy=""
          />
        </div>
      </GridWrapper>
    </div>
  );
}
