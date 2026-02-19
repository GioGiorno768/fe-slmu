// Server Component - No "use client" for SEO
import type { Metadata } from "next";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import ReportAbuseForm from "@/components/landing/ReportAbuseForm";
import { AnimateOnView } from "@/components/landing/AnimateWrappers";
import { ShieldAlert, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata.reportAbuse");
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: "https://shortlinkmu.com/report-abuse",
    },
    twitter: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    alternates: {
      canonical: "https://shortlinkmu.com/report-abuse",
      languages: {
        "id-ID": "https://shortlinkmu.com/id/report-abuse",
        "en-US": "https://shortlinkmu.com/en/report-abuse",
      },
    },
  };
}

export default async function ReportAbuse() {
  const t = await getTranslations("Landing.ReportAbuse");

  const guidelines = [
    {
      icon: AlertTriangle,
      title: t("guidelines.whatCanBeReported.title"),
      items: t.raw("guidelines.whatCanBeReported.items") as string[],
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      icon: CheckCircle,
      title: t("guidelines.howWeHandle.title"),
      items: t.raw("guidelines.howWeHandle.items") as string[],
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
    },
  ];

  return (
    <main className="min-h-screen bg-white font-poppins">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-blue-50/40 to-transparent"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bluelanding/10 text-bluelanding text-sm font-medium mb-6">
              <ShieldAlert className="w-4 h-4" />
              {t("badge")}
            </div>
          </AnimateOnView>

          <AnimateOnView delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-800 mb-5 tracking-tight">
              {t("title1")}{" "}
              <span className="text-bluelanding">{t("title2")}</span>
            </h1>
          </AnimateOnView>

          <AnimateOnView delay={0.2}>
            <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed font-light font-figtree">
              {t("subtitle")}
            </p>
          </AnimateOnView>
        </div>
      </section>

      {/* Guidelines */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidelines.map((guide, index) => (
              <AnimateOnView key={guide.title} delay={index * 0.1}>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 ${guide.iconBg} rounded-xl flex items-center justify-center ${guide.iconColor}`}
                    >
                      <guide.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-800">
                      {guide.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {guide.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-slate-500"
                      >
                        <span className="text-bluelanding mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnView>
            ))}
          </div>

          {/* Response time info */}
          <AnimateOnView>
            <div className="flex items-center justify-center gap-3 mt-8 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>{t("responseTime")}</span>
            </div>
          </AnimateOnView>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16 bg-slate-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnView>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-3">
                {t("form.title")}
              </h2>
              <p className="text-slate-500 font-light font-figtree">
                {t("form.subtitle")}
              </p>
            </div>
          </AnimateOnView>

          <AnimateOnView>
            <ReportAbuseForm />
          </AnimateOnView>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
