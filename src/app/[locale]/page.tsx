import CTASection from "@/components/landing/CTASection";
import DashboardMockup from "@/components/landing/DashboardMockup";
import EarningsCalculator from "@/components/landing/EarningsCalculator";
import FAQSection from "@/components/landing/FAQSection";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import StatsBar from "@/components/landing/StatsBar";

export default function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col bg-white">
        {/* Navbar - handles its own fixed position and scroll state */}
        <Navbar />

        {/* Hero Section */}
        <Hero />

        {/* Dashboard Preview - Overlapping hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-28 relative z-10 mb-16 md:mb-24">
          <DashboardMockup />
        </section>

        {/* Stats Bar */}
        <StatsBar />

        {/* Features */}
        <Features />

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
