"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Info } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function EarningsCalculator() {
  const [views, setViews] = useState(50000);
  const [cpm, setCpm] = useState(15);

  const dailyIncome = (views * cpm) / 1000;
  const weeklyIncome = dailyIncome * 7;
  const monthlyIncome = dailyIncome * 30;
  const yearlyPotential = dailyIncome * 365;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  // Consistent number formatting to prevent hydration mismatch
  const formatNumber = (val: number) =>
    new Intl.NumberFormat("en-US").format(val);

  return (
    <section className="py-24 bg-white relative overflow-hidden font-figtree">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-50 rounded-full translate-x-1/3 -translate-y-1/4 -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Sliders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Estimate Your Earnings
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              See how much you could earn based on your daily traffic. Our CPM
              rates are dynamic and among the most competitive in the industry.
            </p>

            <div className="mt-8 space-y-10">
              {/* Daily Views Slider */}
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Daily Views
                  </label>
                  <span className="text-xl font-bold text-bluelight">
                    {formatNumber(views)}
                  </span>
                </div>
                <input
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-bluelight"
                  max="100000"
                  min="1000"
                  step="1000"
                  type="range"
                  value={views}
                  onChange={(e) => setViews(parseInt(e.target.value))}
                />
              </div>

              {/* CPM Slider */}
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Average CPM
                  </label>
                  <span className="text-xl font-bold text-bluelight">
                    ${cpm.toFixed(2)}
                  </span>
                </div>
                <input
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-bluelight"
                  max="30"
                  min="1"
                  step="0.5"
                  type="range"
                  value={cpm}
                  onChange={(e) => setCpm(parseFloat(e.target.value))}
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-start gap-4">
                <Info className="w-5 h-5 text-bluelight mt-1 shrink-0" />
                <p className="text-sm text-slate-500">
                  Earnings are estimated based on Tier 1 traffic. Actual
                  earnings may vary based on visitor location and ad inventory.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Results Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-bluelight text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-bluelight/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 text-center">
              <p className="text-blue-100 text-lg font-medium mb-2">
                Estimated Monthly Income
              </p>
              <h3 className="text-5xl md:text-6xl font-black mb-10 tracking-tight">
                {formatCurrency(monthlyIncome).split(".")[0]}
                <span className="text-2xl font-bold opacity-60">.00</span>
              </h3>

              <div className="flex flex-col gap-4 bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 text-left">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-blue-100">Daily Income</span>
                  <span className="font-bold text-xl">
                    {formatCurrency(dailyIncome)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-blue-100">Weekly Income</span>
                  <span className="font-bold text-xl">
                    {formatCurrency(weeklyIncome)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Yearly Potential</span>
                  <span className="font-bold text-xl">
                    {formatCurrency(yearlyPotential)}
                  </span>
                </div>
              </div>

              <Link
                href="/register"
                className="mt-8 block w-full bg-white text-bluelight font-bold py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/10 text-center"
              >
                Start Earning Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
