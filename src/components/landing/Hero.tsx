// Server Component - SEO friendly
import { useTranslations } from "next-intl";
import HeroShortLink from "./HeroShortLink";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative overflow-hidden pt-20 pb-32 lg:pt-40 lg:pb-48 bg-white font-figtree">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[800px] opacity-60 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute top-40 -right-20 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-pink-50/50 rounded-full blur-[80px] mix-blend-multiply"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-bluelight text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
          <span className="size-2 rounded-full bg-bluelight animate-pulse"></span>
          Highest CPM Rates 2024
        </div>

        {/* Headline - SEO important */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 max-w-5xl leading-[1.1] text-slate-900">
          Turn Every{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-bluelight to-purple-600">
            Click into Cash
          </span>
        </h1>

        {/* Subtitle - SEO important */}
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
          The highest paying URL shortener for modern publishers. Monetize your
          traffic with secure links, detailed analytics, and daily payouts.
        </p>

        {/* Shortlink Input - Client Component */}
        <div className="w-full max-w-4xl">
          <HeroShortLink />
        </div>
      </div>
    </section>
  );
}
