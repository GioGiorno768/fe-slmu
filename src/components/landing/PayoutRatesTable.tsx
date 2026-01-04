"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search, Globe, DollarSign } from "lucide-react";
import Image from "next/image";

interface Rate {
  country: string;
  cpm: number;
  isoCode: string;
}

interface PayoutRatesTableProps {
  rates: Rate[];
}

export default function PayoutRatesTable({ rates }: PayoutRatesTableProps) {
  const [search, setSearch] = useState("");

  const filteredRates = rates.filter((rate) =>
    rate.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative mb-8"
      >
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-4 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-bluelight/50 focus:border-bluelight transition-all"
          placeholder="Cari negara..."
        />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
      >
        {/* Header */}
        <div className="grid grid-cols-2 bg-slate-900 text-white text-sm font-semibold uppercase tracking-wider">
          <div className="px-6 py-4 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Negara
          </div>
          <div className="px-6 py-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            CPM Rate
          </div>
        </div>

        {/* Body */}
        <div className="divide-y divide-slate-100">
          {filteredRates.length > 0 ? (
            filteredRates.map((rate, index) => (
              <div
                key={rate.country}
                className={`grid grid-cols-2 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                } hover:bg-blue-50/50 transition-colors`}
              >
                <div className="px-6 py-4 flex items-center gap-3">
                  {rate.isoCode === "all" ? (
                    <div className="w-8 h-6 bg-slate-200 rounded flex items-center justify-center">
                      <Globe className="w-4 h-4 text-slate-500" />
                    </div>
                  ) : (
                    <Image
                      src={`https://flagcdn.com/${rate.isoCode}.svg`}
                      alt={`${rate.country} flag`}
                      width={32}
                      height={24}
                      className="rounded shadow-sm"
                    />
                  )}
                  <span className="font-medium text-slate-900">
                    {rate.country}
                  </span>
                </div>
                <div className="px-6 py-4 flex items-center">
                  <span className="text-lg font-bold text-bluelight">
                    ${rate.cpm.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-slate-500">
              Negara tidak ditemukan
            </div>
          )}
        </div>
      </motion.div>

      <p className="text-center text-sm text-slate-500 mt-4 italic">
        * Rates dapat berubah sewaktu-waktu sesuai kondisi market
      </p>
    </div>
  );
}
