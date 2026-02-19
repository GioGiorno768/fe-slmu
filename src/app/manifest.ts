import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shortlinkmu — Perpendek Link & Hasilkan Uang",
    short_name: "Shortlinkmu",
    description:
      "Platform URL shortener terpercaya di Indonesia. Perpendek link dan dapatkan penghasilan dari setiap klik.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4F46E5",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/og-image.png",
        sizes: "1200x630",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
