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
  colorClass,
}: {
  icon: any;
  title: string;
  desc: string;
  colorClass: string;
}) => (
  <div className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-all hover:shadow-xl hover:shadow-slate-500/5 hover:-translate-y-1 font-figtree h-full">
    <div
      className={`size-14 rounded-xl ${colorClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
    >
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default function Features() {
  const features = [
    {
      icon: TrendingUp,
      title: "High CPM Rate",
      desc: "Nikmati rate CPM tinggi hingga $8 berdasarkan negara dan kualitas traffic. Semakin premium audience, semakin besar pendapatan.",
      colorClass: "bg-blue-50 text-blue-600",
    },
    {
      icon: DollarSign,
      title: "Low Minimum Payout",
      desc: "Tarik pendapatan mulai dari $2 saja. Proses lebih cepat dan mudah untuk melihat hasil jerih payah Anda.",
      colorClass: "bg-green-50 text-green-600",
    },
    {
      icon: Headphones,
      title: "Fast Response Support",
      desc: "Tim support kami siap membantu 24/7. Dapatkan bantuan cepat dari admin dan komunitas yang aktif.",
      colorClass: "bg-purple-50 text-purple-600",
    },
    {
      icon: Award,
      title: "Level Akun & Bonus",
      desc: "Naik level seiring pertumbuhan views Anda. Semakin tinggi level, semakin besar bonus dan benefit yang didapat.",
      colorClass: "bg-orange-50 text-orange-600",
    },
    {
      icon: Settings,
      title: "Advanced Link Customize",
      desc: "Kustomisasi link dengan alias, password protection, expiry date, dan pilihan level iklan sesuai kebutuhan.",
      colorClass: "bg-pink-50 text-pink-600",
    },
    {
      icon: Zap,
      title: "Multi-Level Ads System",
      desc: "Pilih level iklan (1-5 step) sesuai preferensi. Semakin banyak step, semakin tinggi CPM rate per klik.",
      colorClass: "bg-teal-50 text-teal-600",
    },
    {
      icon: Wallet,
      title: "Fast Payout",
      desc: "Proses withdrawal cepat hanya 1-7 hari kerja via PayPal, Bank Transfer, atau Crypto. Aman dan terpercaya.",
      colorClass: "bg-amber-50 text-amber-600",
    },
    {
      icon: Users,
      title: "Referral Program",
      desc: "Ajak teman dan dapatkan komisi 10%-25% dari pendapatan mereka secara permanen, tanpa mengurangi earning referral.",
      colorClass: "bg-indigo-50 text-indigo-600",
    },
    {
      icon: Shield,
      title: "Anti-Fraud Protection",
      desc: "Sistem keamanan canggih berbasis IP dan fingerprint untuk melindungi pendapatan Anda dari traffic tidak valid.",
      colorClass: "bg-red-50 text-red-600",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 md:py-32 bg-slate-50/50 font-figtree"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <FeaturesClient>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-slate-900">
              Kenapa Pilih ShortLinkmu?
            </h2>
          </FeaturesClient>
          <FeaturesClient delay={0.1}>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Platform shortlink terpercaya dengan CPM rate tinggi, perlindungan
              anti-fraud, dan fitur lengkap untuk memaksimalkan pendapatan Anda.
            </p>
          </FeaturesClient>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <FeaturesClient key={idx} delay={idx * 0.05}>
              <FeatureCard {...feature} />
            </FeaturesClient>
          ))}
        </div>
      </div>
    </section>
  );
}
