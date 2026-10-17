import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MainSiteLayout } from "../../components/MainSiteLayout";
import { GridWrapper } from "../../components/GridWrapper";
import { sanityFetch } from "@/sanity/lib/fetch";
import { BLOG_POST_QUERY, BLOG_SLUGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PortableTextContent } from "../../components/PortableTextContent";
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
    body?: Array<{_type: string; _key?: string; [key: string]: unknown}>;
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

  return (
    <MainSiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mt-6 space-y-10 md:mt-0 md:space-y-16 pb-0">
        <section className="relative py-12 md:py-16">
          <div className="relative text-balance max-w-3xl mx-auto px-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter text-[#084750] md:text-6xl md:leading-[68px]">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center gap-3 text-text-secondary text-sm">
              {post.author && (
                <span className="font-medium">{post.author.name}</span>
              )}
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
          </div>
        </section>

        {post.mainImage?.asset && (
          <section className="relative">
            <GridWrapper className="before:hidden">
              <div className="relative w-full h-[400px] md:h-[500px] rounded-square overflow-hidden">
                <Image
                  src={urlFor(post.mainImage).width(1400).height(700).url()}
                  alt={post.mainImage.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
              </div>
            </GridWrapper>
          </section>
        )}

        <section className="relative">
          <div className="max-w-3xl mx-auto px-4 prose prose-lg dark:prose-invert prose-headings:text-[#084750] prose-a:text-[#084750]">
            {post.body && <PortableTextContent value={post.body} />}
          </div>
        </section>

        {post.tags && post.tags.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 pb-8">
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm bg-gray-100 dark:bg-neutral-800 text-text-secondary px-3 py-1 rounded-square"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}
      </article>
    </MainSiteLayout>
  );
}
