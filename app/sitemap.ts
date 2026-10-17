import type { MetadataRoute } from "next";
import { siteMetadata } from "@/app/data/siteMetadata";
import { client } from "@/sanity/lib/client";
import { SITEMAP_QUERY } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteMetadata.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteMetadata.siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteMetadata.siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteMetadata.siteUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteMetadata.siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  try {
    const dynamicPages = await client
      .withConfig({ useCdn: false })
      .fetch<Array<{ href: string; _updatedAt: string }>>(SITEMAP_QUERY);

    const blogPages: MetadataRoute.Sitemap = (dynamicPages ?? []).map(
      (page) => ({
        url: `${siteMetadata.siteUrl}${page.href}`,
        lastModified: new Date(page._updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }),
    );

    return [...staticPages, ...blogPages];
  } catch {
    return staticPages;
  }
}
