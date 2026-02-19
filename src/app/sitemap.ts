import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://shortlinkmu.com";
  const locales = ["id", "en"];
  const lastModified = new Date();

  // Public pages that should be indexed
  const publicPages = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    {
      path: "/payout-rates",
      priority: 0.8,
      changeFrequency: "weekly" as const,
    },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    {
      path: "/report-abuse",
      priority: 0.4,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/terms-of-service",
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
    {
      path: "/privacy-policy",
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
    { path: "/login", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/register", priority: 0.5, changeFrequency: "monthly" as const },
    {
      path: "/forgot-password",
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
  ];

  // Blog article slugs (shared across both locales)
  const blogSlugs = [
    "how-to-earn-money-from-shortlinks",
    "what-is-cpm-publisher-guide",
    "5-tips-boost-shortlink-earnings",
    "seo-optimization-for-shortlinks",
    "social-media-monetization-strategy",
    "latest-shortlinkmu-features-update",
  ];

  // Generate entries for all locale + page combinations
  const entries: MetadataRoute.Sitemap = [];

  for (const page of publicPages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  // Blog article entries
  for (const slug of blogSlugs) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
  }

  return entries;
}
