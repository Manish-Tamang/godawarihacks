import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GridPageLayout } from "../components/GridPageLayout";
import { GridSection } from "../components/ui/grid-section";
import { PageHero } from "../components/ui/page-hero";
import { sanityFetch } from "@/sanity/lib/fetch";
import { BLOG_POSTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { siteMetadata } from "@/app/data/siteMetadata";
import type { Blog, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
  description:
    "Read the latest updates, stories, and insights from the Godawari Hacks hackathon community.",
};

export default async function BlogPage() {
  const posts = await sanityFetch<
    Array<{
      _id: string;
      title: string;
      slug: string;
      excerpt?: string;
      mainImage?: {
        asset?: { _id: string; url: string; metadata?: { lqip?: string } };
        alt?: string;
      };
      author?: { name: string };
      publishedAt?: string;
      tags?: string[];
    }>
  >({ query: BLOG_POSTS_QUERY, tags: ["blogPost"] });

  const jsonLd: WithContext<Blog> = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Godawari Hacks Blog",
    description:
      "Updates, stories, and insights from the Godawari Hacks community.",
    url: `${siteMetadata.siteUrl}/blog`,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting" as const,
      headline: post.title,
      url: `${siteMetadata.siteUrl}/blog/${post.slug}`,
      ...(post.excerpt && { description: post.excerpt }),
      ...(post.publishedAt && { datePublished: post.publishedAt }),
      ...(post.author?.name && {
        author: { "@type": "Person" as const, name: post.author.name },
      }),
    })),
  };

  return (
    <GridPageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        title="Blog"
        description={
          <p>
            Updates, stories, and insights from the Godawari Hacks community.
          </p>
        }
      />

      <GridSection className="bg-neutral-50" innerClassName="bg-white">
        {posts.length === 0 ? (
          <p className="px-5 py-24 text-center text-lg text-neutral-500">
            No blog posts yet. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
              >
                {post.mainImage?.asset && (
                  <div className="relative aspect-[3/2] overflow-hidden border-b border-neutral-200 bg-neutral-100">
                    <Image
                      src={urlFor(post.mainImage).width(600).height(400).url()}
                      alt={post.mainImage.alt || post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 340px"
                      {...(post.mainImage.asset.metadata?.lqip
                        ? {
                            placeholder: "blur",
                            blurDataURL: post.mainImage.asset.metadata.lqip,
                          }
                        : {})}
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    {post.author?.name && <span>{post.author.name}</span>}
                    {post.publishedAt && (
                      <>
                        <span>·</span>
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </time>
                      </>
                    )}
                  </div>
                  <h2 className="text-pretty font-display text-lg font-medium text-neutral-900">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="line-clamp-2 text-sm text-neutral-500">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-neutral-200 px-2 py-0.5 text-xs text-neutral-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </GridSection>
    </GridPageLayout>
  );
}
