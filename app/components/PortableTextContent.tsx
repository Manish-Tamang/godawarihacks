import Image from "next/image";
import Link from "next/link";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import type { RichTextValue } from "@/sanity/lib/portable-text";
import { cx } from "../lib/utils";

/**
 * Shared Portable Text renderer used everywhere rich text from Sanity is shown.
 * Keeps marks, lists, blockquotes, links and inline images rendering
 * consistently across the site. Text colour is inherited from the wrapping
 * element so each section can style its own tone.
 *
 * The `types` entries below cover every member of the `blogContent` schema
 * (sanity/schemaTypes/objects/blogContent.ts). A block whose `_type` has no
 * entry here renders as nothing, so the two lists have to stay in step.
 */

const BUTTON_VARIANTS: Record<string, string> = {
  primary:
    "bg-[#084750] text-white hover:bg-[#084750]/90 border border-[#084750]",
  secondary:
    "bg-[#084750]/10 text-[#084750] hover:bg-[#084750]/20 border border-transparent dark:bg-[#084750]/25 dark:text-white",
  outline:
    "border border-border-primary text-text-primary hover:border-[#084750] hover:text-[#084750] dark:border-neutral-700",
  link: "text-[#084750] underline underline-offset-4 hover:text-[#084750]/80",
};

const CALLOUT_TONES: Record<string, { wrapper: string; title: string }> = {
  info: {
    wrapper:
      "border-[#084750]/30 bg-[#084750]/5 dark:border-[#084750]/50 dark:bg-[#084750]/15",
    title: "text-[#084750] dark:text-teal-200",
  },
  tip: {
    wrapper:
      "border-amber-300/60 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10",
    title: "text-amber-800 dark:text-amber-200",
  },
  warning: {
    wrapper:
      "border-red-300/60 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10",
    title: "text-red-800 dark:text-red-200",
  },
  success: {
    wrapper:
      "border-emerald-300/60 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10",
    title: "text-emerald-800 dark:text-emerald-200",
  },
};

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

/** Turns a YouTube or Vimeo watch URL into its embeddable equivalent. */
function toEmbedUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = url.searchParams.get("v") || url.pathname.split("/").pop();
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean).pop();
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }

  return null;
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed last:mb-0">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-[#084750] pl-4 italic text-text-secondary">
        {children}
      </blockquote>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-6 text-2xl font-bold text-text-primary first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-5 text-xl font-semibold text-text-primary first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-4 text-lg font-semibold text-text-primary first:mt-0">
        {children}
      </h4>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 list-disc space-y-1 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 list-decimal space-y-1 pl-6">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => (
      <span className="underline underline-offset-2">{children}</span>
    ),
    "strike-through": ({ children }) => (
      <s className="line-through">{children}</s>
    ),
    highlight: ({ children }) => (
      <mark className="rounded bg-[#084750]/15 px-1 text-inherit dark:bg-[#084750]/35">
        {children}
      </mark>
    ),
    code: ({ children }) => (
      <code className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.9em] dark:bg-white/10">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      const newTab =
        value?.openInNewTab === true ||
        (value?.openInNewTab === undefined && /^https?:\/\//.test(href));
      return (
        <a
          href={href}
          className="text-[#084750] underline underline-offset-2 transition-colors hover:text-[#084750]/80"
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlFor(value).width(1600).fit("max").auto("format").url();
      return (
        <figure className="my-6">
          <Image
            src={url}
            alt={typeof value.alt === "string" ? value.alt : ""}
            width={1600}
            height={900}
            className="h-auto w-full rounded-square"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          {typeof value.caption === "string" && value.caption ? (
            <figcaption className="mt-2 text-center text-sm text-text-tertiary">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },

    buttonGroup: ({ value }) => {
      const buttons = Array.isArray(value?.buttons) ? value.buttons : [];
      if (buttons.length === 0) return null;

      return (
        <div
          className={cx(
            "my-6 flex flex-wrap gap-3",
            value?.align === "center" && "justify-center",
          )}
        >
          {buttons.map(
            (
              button: {
                _key?: string;
                label?: string;
                href?: string;
                variant?: string;
                openInNewTab?: boolean;
              },
              index: number,
            ) => {
              const href = button.href;
              if (!button.label || !href) return null;

              const className = cx(
                "inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium transition-colors rounded-square",
                BUTTON_VARIANTS[button.variant ?? "primary"] ??
                  BUTTON_VARIANTS.primary,
              );

              if (isInternal(href) && !button.openInNewTab) {
                return (
                  <Link
                    key={button._key ?? index}
                    href={href}
                    className={className}
                  >
                    {button.label}
                  </Link>
                );
              }

              return (
                <a
                  key={button._key ?? index}
                  href={href}
                  className={className}
                  {...(button.openInNewTab
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {button.label}
                </a>
              );
            },
          )}
        </div>
      );
    },

    callout: ({ value }) => {
      const tone = CALLOUT_TONES[value?.tone ?? "info"] ?? CALLOUT_TONES.info;
      return (
        <aside
          className={cx(
            "my-6 border-l-4 px-4 py-3 rounded-square",
            tone.wrapper,
          )}
        >
          {typeof value?.title === "string" && value.title ? (
            <p className={cx("mb-1 font-semibold", tone.title)}>
              {value.title}
            </p>
          ) : null}
          <div className="text-sm leading-relaxed text-text-secondary md:text-base">
            <PortableTextContent
              value={value?.body as RichTextValue | undefined}
            />
          </div>
        </aside>
      );
    },

    contentTable: ({ value }) => {
      const rows: Array<{ _key?: string; cells?: string[] }> = Array.isArray(
        value?.rows,
      )
        ? value.rows
        : [];
      if (rows.length === 0) return null;

      const hasHeader = value?.hasHeaderRow !== false;
      const [first, ...rest] = rows;
      const bodyRows = hasHeader ? rest : rows;

      return (
        <figure className="my-6 w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm md:text-base">
            {hasHeader && (
              <thead>
                <tr>
                  {(first.cells ?? []).map((cell, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="border border-border-primary bg-[#084750]/5 px-3 py-2 font-semibold text-text-primary dark:border-neutral-700 dark:bg-white/5"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row, rowIndex) => (
                <tr key={row._key ?? rowIndex}>
                  {(row.cells ?? []).map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border border-border-primary px-3 py-2 align-top text-text-secondary dark:border-neutral-700"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {typeof value?.caption === "string" && value.caption ? (
            <figcaption className="mt-2 text-sm text-text-tertiary">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },

    codeBlock: ({ value }) => {
      if (typeof value?.code !== "string" || !value.code) return null;
      const label =
        (typeof value.filename === "string" && value.filename) ||
        (typeof value.language === "string" && value.language !== "text"
          ? value.language
          : "");

      return (
        <figure className="my-6 overflow-hidden rounded-square border border-border-primary dark:border-neutral-700">
          {label && (
            <figcaption className="border-b border-border-primary bg-black/[0.03] px-3 py-1.5 font-mono text-xs text-text-tertiary dark:border-neutral-700 dark:bg-white/5">
              {label}
            </figcaption>
          )}
          <pre className="overflow-x-auto bg-black/[0.02] p-4 dark:bg-white/[0.03]">
            <code className="font-mono text-[0.85em] leading-relaxed text-text-primary">
              {value.code}
            </code>
          </pre>
        </figure>
      );
    },

    videoEmbed: ({ value }) => {
      const src =
        typeof value?.url === "string" ? toEmbedUrl(value.url) : null;
      if (!src) return null;

      return (
        <figure className="my-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-square border border-border-primary dark:border-neutral-700">
            <iframe
              src={src}
              title={typeof value.title === "string" ? value.title : "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          {typeof value.caption === "string" && value.caption ? (
            <figcaption className="mt-2 text-center text-sm text-text-tertiary">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },

    pullQuote: ({ value }) => {
      if (typeof value?.quote !== "string" || !value.quote) return null;
      const attribution = [value.attribution, value.role]
        .filter((part): part is string => typeof part === "string" && !!part)
        .join(", ");

      return (
        <figure className="my-8 border-y border-border-primary py-6 dark:border-neutral-700">
          <blockquote className="text-xl font-medium leading-snug text-text-primary md:text-2xl">
            &ldquo;{value.quote}&rdquo;
          </blockquote>
          {attribution && (
            <figcaption className="mt-3 text-sm text-text-tertiary">
              — {attribution}
            </figcaption>
          )}
        </figure>
      );
    },

    divider: ({ value }) =>
      value?.variant === "dots" ? (
        <div
          aria-hidden
          className="my-10 text-center font-mono text-lg tracking-[0.6em] text-text-tertiary"
        >
          •••
        </div>
      ) : (
        <hr className="my-10 border-border-primary dark:border-neutral-700" />
      ),
  },
};

export function PortableTextContent({
  value,
  className,
}: {
  value?: RichTextValue | string | null;
  className?: string;
}) {
  if (value == null) return null;

  // Gracefully handle legacy plain-string content that predates the
  // rich-text (Portable Text) schema, so it never reaches the serializer.
  if (typeof value === "string") {
    const text = value.trim();
    if (!text) return null;
    return <p className={className}>{text}</p>;
  }

  if (!Array.isArray(value) || value.length === 0) return null;

  const content = (
    <PortableText
      value={value as unknown as PortableTextBlock[]}
      components={components}
    />
  );

  return className ? <div className={className}>{content}</div> : content;
}
