import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/admin/",
          "/super-admin/",
          "/backdoor/",
          "/api/",
          "/continue/",
          "/verification-pending/",
          "/verify-email/",
          "/expired/",
          "/go/",
          "/test-error/",
          "/maintenance/",
        ],
      },
    ],
    sitemap: "https://shortlinkmu.com/sitemap.xml",
  };
}
