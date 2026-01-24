import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // Bahasa yang didukung
  locales: ["en", "id"],

  // Bahasa default jika user tidak terdeteksi atau langsung buka '/'
  defaultLocale: "id",

  // Opsional: matikan prefix untuk default locale (misal '/about' bukan '/id/about')
  localePrefix: "as-needed",

  // Disable browser Accept-Language detection - use defaultLocale instead
  localeDetection: false,
});

// Wrapper untuk navigasi agar otomatis menyesuaikan dengan locale aktif
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
