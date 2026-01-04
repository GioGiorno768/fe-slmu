// Server Component - SEO friendly, no "use client"
import { Wallet, Bitcoin, Building2, CreditCard } from "lucide-react";
import { Link } from "@/i18n/routing";
import CTAClient from "./CTAClient";

export default function CTASection() {
  const paymentMethods = [
    { icon: Wallet, label: "PayPal" },
    { icon: Bitcoin, label: "Bitcoin" },
    { icon: Building2, label: "Bank Transfer" },
    { icon: CreditCard, label: "Payoneer" },
  ];

  return (
    <div className="flex flex-col font-figtree">
      {/* Payment Providers */}
      <div className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase text-slate-400 mb-10 tracking-[0.2em]">
            Trusted Payment Providers
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity duration-300">
            {paymentMethods.map((method, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xl font-bold text-slate-800"
              >
                <method.icon className="w-8 h-8" />
                {method.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main CTA */}
      <CTAClient>
        <div className="relative py-24 overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-bluelight via-blue-700 to-purple-800"></div>
          <div className="absolute inset-0 opacity-20 brightness-100 contrast-150"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to monetize your links?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-10 font-light">
              Join over 10,000 publishers and start earning today. Sign up now
              and get a $5 sign-up bonus!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-white text-bluelight hover:bg-blue-50 text-lg font-bold py-4 px-10 rounded-xl shadow-xl transition-all text-center"
              >
                Create Free Account
              </Link>
              <Link
                href="/ads-info"
                className="w-full sm:w-auto bg-transparent border-2 border-white/30 hover:bg-white/10 text-white text-lg font-bold py-4 px-10 rounded-xl transition-all text-center"
              >
                View Payout Rates
              </Link>
            </div>
          </div>
        </div>
      </CTAClient>
    </div>
  );
}
