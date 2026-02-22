// Server Component - No "use client" for SEO
import type { Metadata } from "next";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { AnimateOnView } from "@/components/landing/AnimateWrappers";
import AboutCTA from "@/components/landing/AboutCTA";
import {
  Link2,
  Zap,
  Shield,
  TrendingUp,
  Globe,
  Users,
  Sparkles,
  Target,
  Heart,
} from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata.about");
  const locale = await getLocale();
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `https://shortlinkmu.com/${locale}/about`,
    },
    twitter: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    alternates: {
      canonical: `https://shortlinkmu.com/${locale}/about`,
      languages: {
        "id-ID": "https://shortlinkmu.com/id/about",
        "en-US": "https://shortlinkmu.com/en/about",
        "x-default": "https://shortlinkmu.com/en/about",
      },
    },
  };
}

export default async function AboutPage() {
  const t = await getTranslations("Landing.About");

  const highlights = [
    {
      icon: Link2,
      title: t("whatWeOffer.linkShortening.title"),
      description: t("whatWeOffer.linkShortening.desc"),
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: TrendingUp,
      title: t("whatWeOffer.monetization.title"),
      description: t("whatWeOffer.monetization.desc"),
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: Shield,
      title: t("whatWeOffer.secure.title"),
      description: t("whatWeOffer.secure.desc"),
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: Globe,
      title: t("whatWeOffer.global.title"),
      description: t("whatWeOffer.global.desc"),
      color: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const values = [
    {
      icon: Target,
      title: t("values.simple.title"),
      description: t("values.simple.desc"),
    },
    {
      icon: Zap,
      title: t("values.fast.title"),
      description: t("values.fast.desc"),
    },
    {
      icon: Heart,
      title: t("values.fair.title"),
      description: t("values.fair.desc"),
    },
  ];

  return (
    <main className="min-h-screen bg-white font-poppins">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/60 to-transparent"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bluelanding/10 text-bluelanding text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              {t("badge")}
            </div>
          </AnimateOnView>

          <AnimateOnView delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-800 mb-6 tracking-tight">
              {t("title1")}{" "}
              <span className="text-bluelanding">{t("title2")}</span>?
            </h1>
          </AnimateOnView>

          <AnimateOnView delay={0.2}>
            <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-light font-figtree">
              {t("subtitle")}
            </p>
          </AnimateOnView>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnView className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
              {t("whatWeOffer.title")}
            </h2>
            <p className="text-slate-500 text-base md:text-lg font-light max-w-xl mx-auto font-figtree">
              {t("whatWeOffer.subtitle")}
            </p>
          </AnimateOnView>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <AnimateOnView key={item.title} delay={index * 0.1}>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div
                    className={`w-12 h-12 ${item.color} rounded-xl mb-4 flex items-center justify-center ${item.iconColor}`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-figtree">
                    {item.description}
                  </p>
                </div>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Simple */}
      <section className="py-16 md:py-24 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnView>
            <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-bluelanding/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-bluelanding" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">
                  {t("howItWorks.title")}
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-bluelanding text-white rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 mb-1">
                      {t("howItWorks.step1.title")}
                    </h3>
                    <p className="text-slate-500 text-sm font-figtree">
                      {t("howItWorks.step1.desc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-bluelanding text-white rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 mb-1">
                      {t("howItWorks.step2.title")}
                    </h3>
                    <p className="text-slate-500 text-sm font-figtree">
                      {t("howItWorks.step2.desc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-bluelanding text-white rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 mb-1">
                      {t("howItWorks.step3.title")}
                    </h3>
                    <p className="text-slate-500 text-sm font-figtree">
                      {t("howItWorks.step3.desc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnView>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnView className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
              {t("values.title")}
            </h2>
          </AnimateOnView>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <AnimateOnView key={value.title} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-14 h-14 bg-bluelanding/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <value.icon className="w-7 h-7 text-bluelanding" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-figtree">
                    {value.description}
                  </p>
                </div>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Client Component */}
      <AboutCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
