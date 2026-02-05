// Server Component - No "use client" for SEO
import HeroShortLink from "./HeroShortLink";
import HeroParticles from "./HeroParticles";

export default function Hero() {
  return (
    <section className="relative pt-28 pb-36 lg:pt-36 lg:pb-44 bg-white font-poppins overflow-hidden">
      {/* Animated Canvas Background - Client Component */}
      <HeroParticles />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent"></div>
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
        {/* Headline - Semibold, cleaner */}
        <h1 className="text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.5rem] font-semibold tracking-tight mb-5 max-w-4xl leading-[1.15] text-slate-800">
          Turn Every Click
          <br />
          <span className="text-bluelanding">into Cash</span>
        </h1>

        {/* Subtitle - Lighter */}
        <p className="text-base md:text-lg text-slate-500 max-w-xl mb-12 leading-relaxed font-light font-figtree">
          Monetize your traffic with the highest paying URL shortener. Secure
          links, detailed analytics, daily payouts.
        </p>

        {/* Shortlink Form - Client Component */}
        <div className="w-full max-w-2xl mb-16">
          <HeroShortLink />
        </div>

        {/* Trust - Minimal */}
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-amber-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium text-slate-600">4.9</span>
          </div>
          <span className="text-slate-300">•</span>
          <span>Trusted by 10K+ publishers</span>
        </div>
      </div>
    </section>
  );
}
