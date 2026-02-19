// Server Component - No "use client" for SEO
import type { Metadata } from "next";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { AnimateOnView } from "@/components/landing/AnimateWrappers";
import { FileText, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata.termsOfService");
  const locale = await getLocale();
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `https://shortlinkmu.com/${locale}/terms-of-service`,
    },
    twitter: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    alternates: {
      canonical: `https://shortlinkmu.com/${locale}/terms-of-service`,
      languages: {
        "id-ID": "https://shortlinkmu.com/id/terms-of-service",
        "en-US": "https://shortlinkmu.com/en/terms-of-service",
      },
    },
  };
}

// Define which sections have lists and notes
const sectionsWithList = ["account", "prohibited", "earnings", "limitation"];
const sectionsWithNote = ["account", "prohibited"];

const sectionKeys = [
  "acceptance",
  "eligibility",
  "account",
  "service",
  "prohibited",
  "earnings",
  "intellectual",
  "disclaimer",
  "limitation",
  "indemnification",
  "termination",
  "changes",
  "governing",
  "contact",
] as const;

export default async function TermsOfService() {
  const t = await getTranslations("Landing.TermsOfService");

  return (
    <main className="min-h-screen bg-white font-poppins">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-slate-50 to-transparent"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              {t("badge")}
            </div>
          </AnimateOnView>

          <AnimateOnView delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-800 mb-5 tracking-tight">
              {t("title")}
            </h1>
          </AnimateOnView>

          <AnimateOnView delay={0.2}>
            <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed font-light font-figtree">
              {t("subtitle")}
            </p>
          </AnimateOnView>

          <AnimateOnView delay={0.3}>
            <p className="text-sm text-slate-400 mt-4">{t("lastUpdated")}</p>
          </AnimateOnView>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnView>
            <div className="flex flex-wrap gap-2">
              {sectionKeys.map((key) => (
                <a
                  key={key}
                  href={`#${key}`}
                  className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-50 rounded-lg hover:bg-bluelanding hover:text-white transition-all"
                >
                  {t(`sections.${key}.title`).split(". ")[1]}
                </a>
              ))}
            </div>
          </AnimateOnView>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sectionKeys.map((key, index) => {
              const hasList = sectionsWithList.includes(key);
              const hasNote = sectionsWithNote.includes(key);
              const isContactSection = key === "contact";

              return (
                <AnimateOnView key={key} delay={0.05}>
                  <div
                    id={key}
                    className="scroll-mt-24 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow"
                  >
                    <h2 className="text-xl font-semibold text-slate-800 mb-3">
                      {t(`sections.${key}.title`)}
                    </h2>
                    <p className="text-slate-600 leading-relaxed font-figtree">
                      {t(`sections.${key}.content`)}
                    </p>

                    {hasList && (
                      <ul className="mt-4 space-y-2 ml-4">
                        {(t.raw(`sections.${key}.list`) as string[]).map(
                          (item: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-slate-600 font-figtree"
                            >
                              <span className="text-bluelanding mt-1 text-sm">
                                •
                              </span>
                              <span className="text-sm">{item}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    )}

                    {hasNote && (
                      <p className="mt-4 text-sm text-slate-500 italic bg-slate-50 px-4 py-3 rounded-lg font-figtree">
                        {t(`sections.${key}.note`)}
                      </p>
                    )}

                    {isContactSection && (
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 mt-4 text-bluelanding font-medium hover:underline group"
                      >
                        {t("contactUs")}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )}

                    {index < sectionKeys.length - 1 && (
                      <div className="border-b border-slate-100 mt-8"></div>
                    )}
                  </div>
                </AnimateOnView>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
