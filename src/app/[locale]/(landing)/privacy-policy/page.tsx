// Server Component - No "use client" for SEO
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { AnimateOnView } from "@/components/landing/AnimateWrappers";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

// Define section configurations
const sectionKeys = [
  "collection",
  "use",
  "sharing",
  "cookies",
  "security",
  "retention",
  "rights",
  "children",
  "international",
  "thirdparty",
  "changes",
  "contact",
] as const;

// Sections with list property
const sectionsWithList = [
  "use",
  "sharing",
  "cookies",
  "security",
  "retention",
  "rights",
];
// Sections with note property
const sectionsWithNote = ["sharing", "cookies", "security", "rights"];
// Section with subsections (only collection)
const sectionWithSubsections = "collection";
const subsectionKeys = ["personal", "usage", "technical"] as const;

export default async function PrivacyPolicy() {
  const t = await getTranslations("Landing.PrivacyPolicy");

  return (
    <main className="min-h-screen bg-white font-poppins">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-blue-50/60 to-transparent"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bluelanding/10 text-bluelanding text-sm font-medium mb-6">
              <ShieldCheck className="w-4 h-4" />
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
              const hasSubsections = key === sectionWithSubsections;
              const isContactSection = key === "contact";

              return (
                <AnimateOnView key={key} delay={0.05}>
                  <div
                    id={key}
                    className="scroll-mt-24 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow font-figtree"
                  >
                    <h2 className="text-xl font-semibold text-slate-800 mb-3">
                      {t(`sections.${key}.title`)}
                    </h2>
                    <p className="text-slate-600 leading-relaxed font-figtree">
                      {t(`sections.${key}.content`)}
                    </p>

                    {hasSubsections && (
                      <div className="mt-4 space-y-4">
                        {subsectionKeys.map((subKey) => (
                          <div
                            key={subKey}
                            className="bg-slate-50 rounded-lg p-4"
                          >
                            <h4 className="font-medium text-slate-700 mb-2">
                              {t(`sections.${key}.subsections.${subKey}.title`)}
                            </h4>
                            <ul className="space-y-1">
                              {(
                                t.raw(
                                  `sections.${key}.subsections.${subKey}.items`,
                                ) as string[]
                              ).map((item: string, j: number) => (
                                <li
                                  key={j}
                                  className="flex items-start gap-2 text-sm text-slate-600"
                                >
                                  <span className="text-bluelanding mt-0.5">
                                    •
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {hasList && (
                      <ul className="mt-4 space-y-2 ml-4">
                        {(t.raw(`sections.${key}.list`) as string[]).map(
                          (item: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-slate-600"
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
                      <p className="mt-4 text-sm text-slate-500 italic bg-slate-50 px-4 py-3 rounded-lg">
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
