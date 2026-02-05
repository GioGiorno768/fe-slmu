// Server Component - SEO friendly
import {
  TrendingUp,
  Shield,
  DollarSign,
  Wallet,
  Users,
  Award,
  Settings,
  Zap,
  Headphones,
} from "lucide-react";
import FeaturesClient from "./FeaturesClient";

const FeatureCard = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) => (
  <div className="group p-6 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition-all hover:shadow-lg hover:shadow-slate-200/50 font-figtree h-full">
    <div className="size-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:bg-bluelight group-hover:border-bluelight group-hover:text-white transition-all text-slate-600">
      <Icon className="w-5 h-5" strokeWidth={1.5} />
    </div>
    <h3 className="text-base font-semibold mb-2 text-slate-800">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default function Features() {
  const features = [
    {
      icon: TrendingUp,
      title: "High CPM Rate",
      desc: "Earn up to $8 CPM based on traffic quality and geo-location.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "Fast response from our dedicated support team anytime.",
    },
    {
      icon: Award,
      title: "Level & Bonuses",
      desc: "Unlock higher bonuses as your views grow. Earn more rewards.",
    },
    {
      icon: Settings,
      title: "Advanced Customization",
      desc: "Custom alias, password protection, expiry dates, and more.",
    },
    {
      icon: Zap,
      title: "Multi-Level Ads",
      desc: "Choose ad levels (1-5 steps) to maximize your earnings.",
    },
    {
      icon: Wallet,
      title: "Fast Payouts",
      desc: "1-7 day processing via PayPal, Bank Transfer, or Crypto.",
    },
    {
      icon: Users,
      title: "Referral Program",
      desc: "Earn 10-25% lifetime commission from your referrals.",
    },
    {
      icon: Shield,
      title: "Anti-Fraud Protection",
      desc: "Advanced IP & fingerprint security to protect your earnings.",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-white font-poppins">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Clean style like Hero */}
        <div className="text-center mb-14 md:mb-16">
          <FeaturesClient>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-tight mb-4 text-slate-800">
              Why Choose <span className="text-bluelight">Shortlinkmu</span>?
            </h2>
          </FeaturesClient>
          <FeaturesClient delay={0.1}>
            <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light">
              Built for publishers who want to maximize their earnings with
              premium features and reliable payouts.
            </p>
          </FeaturesClient>
        </div>

        {/* Cards Grid - Smaller, cleaner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature, idx) => (
            <FeaturesClient key={idx} delay={idx * 0.03}>
              <FeatureCard {...feature} />
            </FeaturesClient>
          ))}
        </div>
      </div>
    </section>
  );
}
