import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MainSiteLayout } from "../../components/MainSiteLayout";
import { GridWrapper } from "../../components/GridWrapper";
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
        ? { images: [{ url: post.mainImage.asset.url, width: 1200, height: 630 }] }
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
    mainImage?: { asset?: { _id: string; url: string; metadata?: { lqip?: string; dimensions?: { width: number; height: number } } }; alt?: string };
    body?: RichTextValue;
    author?: { name: string; role?: string; image?: { asset?: { url: string } } };
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
    ...(post.author ? { author: { "@type": "Person", name: post.author.name } } : {}),
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
    <MainSiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mt-6 space-y-10 pb-0 md:mt-0 md:space-y-16">
        <section className="relative py-12 md:py-16">
          <div className="relative text-balance">
            <h1 className="mx-auto max-w-3xl text-center text-4xl font-bold leading-tight tracking-tighter text-[#084750] md:text-6xl md:leading-[68px]">
              {post.title}
            </h1>
            <div className="mt-4 text-center">
              {post.excerpt && (
                <p className="mx-auto max-w-3xl text-base text-text-secondary md:text-lg">
                  {post.excerpt}
                </p>
              )}
              {(post.author || publishedLabel) && (
                <p className="mt-3 font-mono text-xs tabular-nums text-text-tertiary">
                  {post.author?.name}
                  {post.author && publishedLabel ? " · " : ""}
                  {publishedLabel}
                </p>
              )}
            </div>
          </div>
        </section>

        {post.mainImage?.asset && (
          <section className="relative">
            <GridWrapper>
              <div className="p-2 md:p-4">
                <div className="relative h-[240px] w-full overflow-hidden rounded-square md:h-[460px]">
                  <Image
                    src={urlFor(post.mainImage).width(1400).height(700).url()}
                    alt={post.mainImage.alt || post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1150px) 100vw, 1150px"
                    {...(post.mainImage.asset.metadata?.lqip
                      ? {
                          placeholder: "blur" as const,
                          blurDataURL: post.mainImage.asset.metadata.lqip,
                        }
                      : {})}
                  />
                </div>
              </div>
            </GridWrapper>
          </section>
        )}

        <section className="relative">
          <GridWrapper>
            <div className="px-4 py-10 md:px-8 md:py-14">
              {/* Capped at a readable measure, but inside the same full-width
                  rails every other page uses, so the hairlines line up. */}
              <div className="mx-auto w-full max-w-[68ch] text-base leading-7 text-text-secondary md:text-lg">
                <PortableTextContent value={post.body} />
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mx-auto mt-10 w-full max-w-[68ch] border-t border-border-primary/50 pt-6 dark:border-neutral-700/50">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-square bg-gray-100 px-3 py-1 text-sm text-text-secondary dark:bg-neutral-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mx-auto mt-10 w-full max-w-[68ch]">
                <Link
                  href="/blog"
                  className="text-sm font-medium text-[#084750] underline underline-offset-4 transition-colors hover:text-[#084750]/80"
                >
                  ← All posts
                </Link>
              </div>
            </div>
          </GridWrapper>
        </section>
      </article>
    </MainSiteLayout>
  );
}
