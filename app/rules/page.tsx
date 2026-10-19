import type { Metadata } from "next";
import Link from "next/link";
import { MainSiteLayout } from "../components/MainSiteLayout";
import { GridWrapper } from "../components/GridWrapper";
import { AnimatedText } from "../components/AnimatedText";
import { PortableTextContent } from "../components/PortableTextContent";
import { sanityFetch } from "@/sanity/lib/fetch";
import { RULES_PAGE_QUERY } from "@/sanity/lib/queries";
import { DEFAULT_RULES } from "@/sanity/lib/default-rules";
import type { RichTextValue } from "@/sanity/lib/portable-text";

type RulesPageData = {
  title?: string;
  description?: string;
  lastUpdated?: string;
  body?: RichTextValue;
  seo?: { title?: string; description?: string; noIndex?: boolean };
} | null;

const DEFAULT_TITLE = "Rules";
const DEFAULT_DESCRIPTION =
  "Everything you need to know to compete fairly at Godawari Hacks.";

async function getRulesPage() {
  return sanityFetch<RulesPageData>({
    query: RULES_PAGE_QUERY,
    tags: ["rulesPage"],
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const rulesPage = await getRulesPage();

  return {
    title: rulesPage?.seo?.title || rulesPage?.title || DEFAULT_TITLE,
    description:
      rulesPage?.seo?.description ||
      rulesPage?.description ||
      DEFAULT_DESCRIPTION,
    alternates: { canonical: "/rules" },
    ...(rulesPage?.seo?.noIndex ? { robots: "noindex" } : {}),
  };
}

export default async function RulesPage() {
  const HEADING_DELAY = 0.2;
  const PARAGRAPH_DELAY = HEADING_DELAY + 0.1;

  const rulesPage = await getRulesPage();
  const body = rulesPage?.body?.length ? rulesPage.body : DEFAULT_RULES;

  const lastUpdatedLabel = rulesPage?.lastUpdated
    ? new Date(rulesPage.lastUpdated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <MainSiteLayout>
      <section className="space-y-10 md:space-y-16 pb-0">
        <section className="relative mt-14 pb-12 md:pb-16">
          <div className="relative z-10 flex flex-col items-center pt-24 text-balance md:pt-32">
            <AnimatedText
              as="h1"
              delay={HEADING_DELAY}
              className="mx-auto w-full max-w-4xl text-center font-helvetica text-5xl font-bold leading-tight tracking-tighter text-[#084750] md:text-7xl md:leading-[80px]"
            >
              {rulesPage?.title || DEFAULT_TITLE}
            </AnimatedText>
            <div className="mt-4 text-center md:mt-6">
              <AnimatedText
                as="p"
                delay={PARAGRAPH_DELAY}
                className="mx-auto max-w-2xl px-4 text-base leading-7 text-text-secondary md:text-lg"
              >
                {rulesPage?.description || DEFAULT_DESCRIPTION}
              </AnimatedText>
              {lastUpdatedLabel && (
                <p className="mt-3 font-mono text-xs tabular-nums text-text-tertiary">
                  Last updated {lastUpdatedLabel}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="relative bg-bg-primary dark:bg-neutral-900">
          <GridWrapper>
            <div className="px-4 py-10 md:px-8 md:py-14">
              <div className="mx-auto w-full max-w-[68ch] text-base leading-7 text-text-secondary md:text-lg">
                <PortableTextContent value={body} />
              </div>

              <div className="mx-auto mt-10 flex w-full max-w-[68ch] flex-col gap-4 border-t border-border-primary/50 pt-6 sm:flex-row dark:border-neutral-700/50">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-[#084750] text-center text-white font-semibold rounded-square hover:bg-[#084750]/80 transition-colors"
                >
                  Register Now
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 border-2 border-border-primary text-center text-text-primary font-semibold rounded-square hover:bg-gray-50 transition-colors"
                >
                  Ask a Question
                </Link>
              </div>
            </div>
          </GridWrapper>
        </section>
      </section>
    </MainSiteLayout>
  );
}
