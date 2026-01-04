// src/components/dashboard/TopPerformingLinksCard.tsx
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Loader2,
  ExternalLink,
  ChevronDown,
  Trophy,
  Medal,
  Link2,
  Eye,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
  Coins,
  ChartNoAxesColumn,
  Megaphone,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";
import type { TopPerformingLink } from "@/types/type";

// Terima data lewat props
interface TopPerformingLinksCardProps {
  data: TopPerformingLink[] | null;
}

export default function TopPerformingLinksCard({
  data,
}: TopPerformingLinksCardProps) {
  const t = useTranslations("Dashboard");

  // State UI
  const [sortBy, setSortBy] = useState<"highest" | "lowest">("highest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Logic Sorting Client-Side (Pake useMemo biar efisien)
  const sortedLinks = useMemo(() => {
    if (!data) return [];
    // Copy array dulu biar gak mutasi props langsung
    return [...data].sort((a, b) => {
      if (sortBy === "highest") return b.validViews - a.validViews;
      return a.validViews - b.validViews; // Lowest
    });
  }, [data, sortBy]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Helper Icon Rank
  const getRankIcon = (index: number) => {
    if (sortBy === "lowest") {
      return (
        <span className="text-[1.2em] font-mono text-grays">
          <TrendingDown className="w-5 h-5 text-redshortlink" />
        </span>
      );
    }
    switch (index) {
      case 0:
        return (
          <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
        );
      case 1:
        return <Medal className="w-6 h-6 text-slate-400 fill-slate-400/20" />;
      case 2:
        return <Medal className="w-6 h-6 text-orange-500 fill-orange-500/20" />;
      default:
        return <Link2 className="w-5 h-5 text-bluelight" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm shadow-slate-500/50 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      {/* --- Header --- */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[1.8em] font-semibold text-shortblack tracking-tight flex items-center gap-2">
          {t("topPerformingLinks")}
        </h3>

        {/* Dropdown Filter */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 text-[1.3em] bg-blues font-medium text-bluelight transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-dashboard"
          >
            {sortBy === "highest" ? "Teratas" : "Terbawah"}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isSortOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-20 overflow-hidden"
              >
                <button
                  onClick={() => {
                    setSortBy("highest");
                    setIsSortOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-2 w-full text-left text-[1.3em] px-3 py-2 rounded-lg transition-colors",
                    sortBy === "highest"
                      ? "bg-blue-50 text-bluelight font-semibold"
                      : "text-shortblack hover:bg-blues/30"
                  )}
                >
                  <ArrowUpWideNarrow className="w-4 h-4" /> Teratas
                </button>
                <button
                  onClick={() => {
                    setSortBy("lowest");
                    setIsSortOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-2 w-full text-left text-[1.3em] px-3 py-2 rounded-lg transition-colors",
                    sortBy === "lowest"
                      ? "bg-blue-50 text-bluelight font-semibold"
                      : "text-shortblack hover:bg-blues/30"
                  )}
                >
                  <ArrowDownWideNarrow className="w-4 h-4" /> Terbawah
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- List Content --- */}
      <div className="flex-1 relative min-h-[250px]">
        {!data ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
          </div>
        ) : (
          <div
            onWheel={(e) => e.stopPropagation()}
            className="space-y-0 overflow-y-auto h-[340px] pr-2 custom-scrollbar-minimal"
          >
            {sortedLinks.map((link, index) => (
              <div
                key={link.id}
                className={clsx(
                  "transition-all duration-200 rounded-2xl mb-2",
                  expandedId === link.id
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50/50 shadow-sm border border-blue-100"
                    : "hover:bg-blues/30"
                )}
              >
                {/* Main Row */}
                <div
                  onClick={() => toggleAccordion(link.id)}
                  className="flex items-center gap-3 p-4 cursor-pointer group"
                >
                  {/* Rank Badge */}
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      index === 0 && sortBy === "highest"
                        ? "bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-200"
                        : index === 1 && sortBy === "highest"
                        ? "bg-gradient-to-br from-slate-300 to-slate-400 shadow-md shadow-slate-200"
                        : index === 2 && sortBy === "highest"
                        ? "bg-gradient-to-br from-orange-400 to-amber-600 shadow-md shadow-orange-200"
                        : "bg-blues"
                    )}
                  >
                    {sortBy === "lowest" ? (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    ) : index === 0 ? (
                      <Trophy className="w-5 h-5 text-white" />
                    ) : index === 1 ? (
                      <Medal className="w-5 h-5 text-white" />
                    ) : index === 2 ? (
                      <Medal className="w-5 h-5 text-white" />
                    ) : (
                      <Link2 className="w-4 h-4 text-bluelight" />
                    )}
                  </div>

                  {/* Link Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={clsx(
                        "text-[1.35em] font-semibold truncate transition-colors",
                        expandedId === link.id
                          ? "text-bluelight"
                          : "text-shortblack group-hover:text-bluelight"
                      )}
                    >
                      {link.title}
                    </p>
                    <p className="text-[1.15em] text-grays truncate">
                      {link.shortUrl}
                    </p>
                  </div>

                  {/* Earnings Badge */}
                  {/* <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
                    <Coins className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-[1.15em] font-bold text-green-700">
                      ${link.totalEarnings.toFixed(2)}
                    </span>
                  </div> */}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      onClick={(e) => e.stopPropagation()}
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/80 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-bluelight" />
                    </a>
                    <ChevronDown
                      className={clsx(
                        "w-4 h-4 text-grays transition-transform duration-300",
                        expandedId === link.id && "rotate-180 text-bluelight"
                      )}
                    />
                  </div>
                </div>

                {/* Accordion Detail - Simplified */}
                <AnimatePresence>
                  {expandedId === link.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-blue-100/50">
                          {/* Views */}
                          <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-xl">
                            <Eye className="w-4 h-4 text-bluelight" />
                            <div className="flex flex-col">
                              <span className="text-[1em] text-grays">
                                Views
                              </span>
                              <span className="text-[1.2em] font-bold text-shortblack">
                                {link.validViews.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Earnings (Mobile) */}
                          <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-xl">
                            <Coins className="w-4 h-4 text-green-600" />
                            <div className="flex flex-col">
                              <span className="text-[1em] text-grays">
                                Earned
                              </span>
                              <span className="text-[1.2em] font-bold text-green-700">
                                ${link.totalEarnings.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Ads Level */}
                          <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-xl">
                            <Megaphone className="w-4 h-4 text-purple-500" />
                            <div className="flex flex-col">
                              <span className="text-[1em] text-grays">
                                Level
                              </span>
                              <span className="text-[1.2em] font-bold text-shortblack capitalize">
                                {link.adsLevel}
                              </span>
                            </div>
                          </div>

                          {/* View in Links */}
                          {/* <Link
                            onClick={(e) => e.stopPropagation()}
                            href={`/new-link?highlight=${link.id}`}
                            className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-bluelight text-white rounded-xl text-[1.1em] font-semibold hover:bg-bluelight/90 transition-colors"
                          >
                            <span>Detail</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link> */}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className=" text-center">
        <Link
          href="/new-link"
          className="text-[1.3em] font-semibold text-grays hover:text-bluelight flex items-center justify-center gap-1 transition-colors"
        >
          Lihat Semua Link <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
