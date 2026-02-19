import CTASection from "@/components/landing/CTASection";
import DashboardMockup from "@/components/landing/DashboardMockup";
import EarningsCalculator from "@/components/landing/EarningsCalculator";
import FAQSection from "@/components/landing/FAQSection";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Navbar from "@/components/landing/Navbar";
import PaymentMethods from "@/components/landing/PaymentMethods";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("Landing.Tagline");
  const faq = await getTranslations("Landing.FAQ");

  // ── JSON-LD Structured Data ──
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Shortlinkmu",
    url: "https://shortlinkmu.com",
    description:
      "Platform URL shortener terpercaya di Indonesia. Perpendek link dan hasilkan uang dari setiap klik.",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Shortlinkmu",
    url: "https://shortlinkmu.com",
    logo: "https://shortlinkmu.com/landing/logo.svg",
    description:
      "Platform URL shortener terpercaya di Indonesia untuk memperpendek link dan menghasilkan uang.",
    sameAs: [
      "https://youtube.com/@shortlinkmu",
      "https://t.me/shortlinkmu",
      "https://instagram.com/shortlinkmu",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@shortlinkmu.com",
      contactType: "customer support",
      availableLanguage: ["Indonesian", "English"],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: faq("q1.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: faq("q1.answer"),
        },
      },
      {
        "@type": "Question",
        name: faq("q2.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: faq("q2.answer"),
        },
      },
      {
        "@type": "Question",
        name: faq("q3.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: faq("q3.answer"),
        },
      },
      {
        "@type": "Question",
        name: faq("q4.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: faq("q4.answer"),
        },
      },
      {
        "@type": "Question",
        name: faq("q5.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: faq("q5.answer"),
        },
      },
      {
        "@type": "Question",
        name: faq("q6.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: faq("q6.answer"),
        },
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="min-h-screen flex flex-col bg-white">
        {/* Navbar - handles its own fixed position and scroll state */}
        <Navbar />

        {/* Hero Section */}
        <Hero />

        {/* Dashboard Preview - Overlapping hero */}
        <section className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-10 mb-16 md:mb-24">
          <DashboardMockup />
        </section>

        {/* Tagline Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-600 font-light leading-relaxed">
              {t("part1")}{" "}
              <strong className="text-slate-900 font-medium">
                {t("highlight")}
              </strong>{" "}
              {t("part2")}
            </p>
          </div>
        </section>

        {/* Stats Bar */}
        {/* <StatsBar /> */}

        {/* Features */}
        <Features />

        {/* How It Works */}
        <HowItWorks />

        {/* Payment Methods */}
        <PaymentMethods />

        {/* Earnings Calculator */}
        <EarningsCalculator />

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
