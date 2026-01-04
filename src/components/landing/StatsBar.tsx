// Server Component - No "use client" for SEO
import { Users, DollarSign, Link2, Globe } from "lucide-react";
import StatsBarClient from "./StatsBarClient";

export default function StatsBar() {
  const stats = [
    { icon: Users, label: "Active Publishers", value: "10k+" },
    { icon: DollarSign, label: "Paid to Users", value: "$1.2M+" },
    { icon: Link2, label: "Links Created", value: "50M+" },
    { icon: Globe, label: "Countries", value: "150+" },
  ];

  return (
    <section className="border-y border-slate-100 bg-white font-figtree">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center md:divide-x divide-slate-100">
          {stats.map((stat, idx) => (
            <StatsBarClient key={idx} delay={idx * 0.1}>
              <div className="flex flex-col gap-2 items-center">
                <span className="text-3xl md:text-4xl font-extrabold text-slate-900 font-manrope tracking-tight">
                  {stat.value}
                </span>
                <span className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  {stat.label}
                </span>
              </div>
            </StatsBarClient>
          ))}
        </div>
      </div>
    </section>
  );
}
