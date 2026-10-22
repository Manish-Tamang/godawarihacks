import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { GridPageLayout } from "../../components/GridPageLayout";
import { GridSection } from "../../components/ui/grid-section";
import { PageHero } from "../../components/ui/page-hero";
import { ChevronRightIcon } from "../../components/icons/ui-icons";
import { sanityFetch } from "@/sanity/lib/fetch";
import { BLOG_POST_QUERY, BLOG_SLUGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PortableTextContent } from "../../components/PortableTextContent";
import type { RichTextValue } from "@/sanity/lib/portable-text";
import type { Article, WithContext } from "schema-dts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await sanityFetch<Array<{ slug: string }>>({
    query: BLOG_SLUGS_QUERY,
    revalidate: 3600,
  });
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<{
    title: string;
    excerpt?: string;
    mainImage?: { asset?: { url: string } };
    seo?: { title?: string; description?: string; noIndex?: boolean };
  } | null>({
    query: BLOG_POST_QUERY,
    params: { slug },
    tags: [`blogPost:${slug}`],
  });

  if (!post) return {};

  return {
    title: post.seo?.title || `${post.title} - Godawari Hacks`,
    description: post.seo?.description || post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    ...(post.seo?.noIndex ? { robots: "noindex" } : {}),
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      ...(post.mainImage?.asset?.url
        ? {
            images: [
              { url: post.mainImage.asset.url, width: 1200, height: 630 },
            ],
          }
        : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await sanityFetch<{
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    mainImage?: {
      asset?: {
        _id: string;
        url: string;
        metadata?: {
          lqip?: string;
          dimensions?: { width: number; height: number };
        };
      };
      alt?: string;
    };
    body?: RichTextValue;
    author?: {
      name: string;
      role?: string;
      image?: { asset?: { url: string } };
    };
    publishedAt?: string;
    tags?: string[];
  } | null>({
    query: BLOG_POST_QUERY,
    params: { slug },
    tags: [`blogPost:${slug}`],
  });

  if (!post) notFound();

  const jsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.author
      ? { author: { "@type": "Person", name: post.author.name } }
      : {}),
    ...(post.mainImage?.asset?.url ? { image: post.mainImage.asset.url } : {}),
    publisher: {
      "@type": "Organization",
      name: "Godawari Hacks",
      url: "https://hack.godawari.edu.np",
    },
  };

  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <GridPageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <PageHero
          eyebrow={
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1 text-xs text-neutral-500"
            >
              <Link
                href="/blog"
                className="transition-colors hover:text-neutral-800"
              >
                Blog
              </Link>
              <ChevronRightIcon className="size-3 text-neutral-400" />
              <span className="truncate">{post.title}</span>
            </nav>
          }
          title={post.title}
          description={
            post.excerpt && <p className="text-base">{post.excerpt}</p>
          }
        >
          {post.mainImage?.asset && (
            <div className="relative mt-10 aspect-[720/530] overflow-hidden rounded-2xl sm:aspect-[1040/510]">
              <Image
                src={urlFor(post.mainImage).width(1400).height(700).url()}
                alt={post.mainImage.alt || post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1080px) 100vw, 1040px"
                {...(post.mainImage.asset.metadata?.lqip
                  ? {
                      placeholder: "blur" as const,
                      blurDataURL: post.mainImage.asset.metadata.lqip,
                    }
                  : {})}
              />
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]" />
            </div>
          )}
        </PageHero>

        <GridSection innerClassName="flex flex-col-reverse gap-8 px-4 py-5 sm:px-5 lg:flex-row lg:items-start lg:gap-14">
          <div className="min-w-0 flex-1 py-6 lg:max-w-[640px] lg:pl-5">
            <div className="text-base leading-7 text-neutral-600 md:text-lg md:leading-8">
              <PortableTextContent value={post.body} />
            </div>
            <Link
              href="/blog"
              className="mt-12 inline-block text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              ← All posts
            </Link>
          </div>

          {(post.author ||
            publishedLabel ||
            (post.tags && post.tags.length > 0)) && (
            <aside className="w-full space-y-6 rounded-xl bg-neutral-50 p-6 lg:sticky lg:top-20 lg:mt-6 lg:w-[340px] lg:shrink-0">
              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.image?.asset?.url && (
                    <Image
                      src={post.author.image.asset.url}
                      alt={post.author.name}
                      width={36}
                      height={36}
                      className="size-9 rounded-full border border-neutral-200 object-cover"
                    />
                  )}
                  <div className="text-sm">
                    <p className="font-semibold text-neutral-800">
                      {post.author.name}
                    </p>
                    {post.author.role && (
                      <p className="text-neutral-500">{post.author.role}</p>
                    )}
                  </div>
                </div>
              )}
              {publishedLabel && post.publishedAt && (
                <time
                  dateTime={post.publishedAt}
                  className="block font-mono text-xs tabular-nums text-neutral-500"
                >
                  {publishedLabel}
                </time>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-xs text-neutral-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </aside>
          )}
        </GridSection>
      </article>
    </GridPageLayout>
  );
}
