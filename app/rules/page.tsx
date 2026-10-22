import type { Metadata } from "next";
import { GridPageLayout } from "../components/GridPageLayout";
import { GridSection } from "../components/ui/grid-section";
import { PageHero } from "../components/ui/page-hero";
import { Button } from "../components/ui/button";
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
    <GridPageLayout>
      <PageHero
        title={rulesPage?.title || DEFAULT_TITLE}
        description={<p>{rulesPage?.description || DEFAULT_DESCRIPTION}</p>}
      >
        {lastUpdatedLabel && (
          <p className="mt-4 font-mono text-xs tabular-nums text-neutral-500">
            Last updated {lastUpdatedLabel}
          </p>
        )}
      </PageHero>

      <GridSection innerClassName="flex flex-col gap-8 px-4 py-5 sm:px-5 lg:flex-row lg:items-start lg:gap-14">
        <div className="min-w-0 flex-1 py-6 text-base leading-7 text-neutral-600 md:text-lg md:leading-8 lg:max-w-[640px] lg:pl-5">
          <PortableTextContent value={body} />
        </div>
        <aside className="flex w-full flex-col gap-2 rounded-xl bg-neutral-50 p-6 sm:flex-row lg:sticky lg:top-20 lg:mt-6 lg:w-[340px] lg:shrink-0 lg:flex-col">
          <Button href="/register" className="w-full">
            Register Now
          </Button>
          <Button href="/contact" variant="secondary" className="w-full">
            Ask a Question
          </Button>
        </aside>
      </GridSection>
    </GridPageLayout>
  );
}
