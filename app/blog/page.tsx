import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MainSiteLayout } from "../components/MainSiteLayout";
import { GridWrapper } from "../components/GridWrapper";
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
      mainImage?: { asset?: { _id: string; url: string; metadata?: { lqip?: string } }; alt?: string };
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
      ...(post.excerpt && {description: post.excerpt}),
      ...(post.publishedAt && {datePublished: post.publishedAt}),
      ...(post.author?.name && {
        author: {"@type": "Person" as const, name: post.author.name},
      }),
    })),
  };

  return (
    <MainSiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mt-6 space-y-10 md:mt-0 md:space-y-16 pb-0">
        <section className="relative py-12 md:py-16">
          <div className="relative text-balance">
            <h1 className="mx-auto max-w-2xl text-center text-5xl font-bold leading-tight tracking-tighter text-[#084750] md:text-7xl md:leading-[78px]">
              Blog
            </h1>
            <div className="mt-4 text-center">
              <p className="text-text-secondary text-base md:text-lg max-w-3xl mx-auto">
                Updates, stories, and insights from the Godawari Hacks community.
              </p>
            </div>
          </div>
        </section>

        <section className="relative">
          <GridWrapper>
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-text-secondary text-lg">
                  No blog posts yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {posts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-square border border-border-primary overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {post.mainImage?.asset && (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={urlFor(post.mainImage).width(600).height(400).url()}
                          alt={post.mainImage.alt || post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          {...(post.mainImage.asset.metadata?.lqip ? { placeholder: "blur", blurDataURL: post.mainImage.asset.metadata.lqip } : {})}
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <h2 className="text-xl font-semibold text-text-primary group-hover:text-[#084750] transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-text-secondary text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-text-tertiary">
                        {post.author?.name && <span>{post.author.name}</span>}
                        {post.publishedAt && (
                          <>
                            <span>·</span>
                            <time dateTime={post.publishedAt}>
                              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </time>
                          </>
                        )}
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 dark:bg-neutral-800 text-text-secondary px-2 py-0.5 rounded"
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
          </GridWrapper>
        </section>
      </section>
    </MainSiteLayout>
  );
}
