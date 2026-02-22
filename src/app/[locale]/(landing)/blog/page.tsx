// Server Component - No "use client" for SEO
import type { Metadata } from "next";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { AnimateOnView } from "@/components/landing/AnimateWrappers";
import BlogContent from "@/components/landing/BlogContent";
import { BookOpen } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata.blog");
  const locale = await getLocale();
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `https://shortlinkmu.com/${locale}/blog`,
    },
    twitter: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    alternates: {
      canonical: `https://shortlinkmu.com/${locale}/blog`,
      languages: {
        "id-ID": "https://shortlinkmu.com/id/blog",
        "en-US": "https://shortlinkmu.com/en/blog",
        "x-default": "https://shortlinkmu.com/en/blog",
      },
    },
  };
}

export default async function BlogPage() {
  const t = await getTranslations("Landing.Blog");

  return (
    <main className="min-h-screen bg-white font-poppins">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/60 to-transparent"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bluelanding/10 text-bluelanding text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              {t("badge")}
            </div>
          </AnimateOnView>

          <AnimateOnView delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-800 mb-6 tracking-tight">
              {t("title1")}{" "}
              <span className="text-bluelanding">{t("title2")}</span>
            </h1>
          </AnimateOnView>

          <AnimateOnView delay={0.2}>
            <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-light font-figtree">
              {t("subtitle")}
            </p>
          </AnimateOnView>
        </div>
      </section>

      {/* Blog Content (Client Component) */}
      <BlogContent />

      {/* Footer */}
      <Footer />
    </main>
  );
}
