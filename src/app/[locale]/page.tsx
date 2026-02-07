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

  return (
    <>
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
