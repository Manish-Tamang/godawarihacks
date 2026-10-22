"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { GridSection } from "./ui/grid-section";
import { SectionHeading } from "./ui/section-heading";

const STYLE_ID = "gh-instagram-feed-style";

const FEED_STYLE = `
  a[href*="elfsight.com"] {
    display: none !important;
  }
  .es-card-container,
  .es-card-media,
  .es-media-container,
  .es-media-image {
    border-radius: 12px !important;
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
    <GridSection id="instagram" innerClassName="pt-10 sm:pt-20">
      <SectionHeading
        className="px-4 sm:px-10"
        title="Follow us on Instagram"
        description={
          <p>
            Photos, announcements, and updates from the hackathon as they
            happen.
          </p>
        }
      />
      <div
        ref={rootRef}
        className="mt-10 border-t border-grid-border bg-neutral-50 px-4 py-8 sm:mt-16 sm:px-10"
      >
        <Script
          src="https://elfsightcdn.com/platform.js"
          strategy="afterInteractive"
        />
        <div
          className="elfsight-app-1308c973-0548-4c23-b06b-0f8f4021b808 min-h-[280px]"
          data-elfsight-app-lazy=""
        />
      </div>
    </GridSection>
  );
}
