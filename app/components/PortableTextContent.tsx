import Image from "next/image";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import type { RichTextValue } from "@/sanity/lib/portable-text";

/**
 * Shared Portable Text renderer used everywhere rich text from Sanity is shown.
 * Keeps marks, lists, blockquotes, links and inline images rendering
 * consistently across the site. Text colour is inherited from the wrapping
 * element so each section can style its own tone.
 */
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
    code: ({ children }) => (
      <code className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.9em] dark:bg-white/10">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="text-[#084750] underline underline-offset-2 transition-colors hover:text-[#084750]/80"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
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
