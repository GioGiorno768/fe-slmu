"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Search, ChevronDown, Globe } from "lucide-react";
import clsx from "clsx";
import type { CountryRate } from "@/services/adLevelService";
import { formatCPM } from "@/services/adLevelService";
import { COUNTRIES, getCountryFlag } from "@/utils/countries";
import { motion, AnimatePresence } from "motion/react";

interface CountryRateEditorProps {
  countryRates: CountryRate[];
  onChange: (rates: CountryRate[]) => void;
  defaultCpcRate: number; // For reference display
  disabled?: boolean;
}

export default function CountryRateEditor({
  countryRates,
  onChange,
  defaultCpcRate,
  disabled = false,
}: CountryRateEditorProps) {
  const [isExpanded, setIsExpanded] = useState(countryRates.length > 0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get available countries (not already selected)
  const selectedCodes = new Set(countryRates.map((r) => r.countryCode));
  const availableCountries = COUNTRIES.filter(
    (c) => !selectedCodes.has(c.code)
  ).filter(
    (c) =>
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCountry = (countryCode: string, countryName: string) => {
    const newRate: CountryRate = {
      countryCode,
      countryName,
      level1Rate: defaultCpcRate,
      level2Rate: defaultCpcRate,
      level3Rate: defaultCpcRate,
      level4Rate: defaultCpcRate,
      cpcRate: defaultCpcRate, // Legacy - Start with default rate
    };
    onChange([...countryRates, newRate]);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  const handleRemoveCountry = (countryCode: string) => {
    onChange(countryRates.filter((r) => r.countryCode !== countryCode));
  };

  const handleUpdateRate = (countryCode: string, newRate: number) => {
    onChange(
      countryRates.map((r) =>
        r.countryCode === countryCode ? { ...r, cpcRate: newRate } : r
      )
    );
  };

  return (
    <div className="border-2 border-gray-200 rounded-2xl ">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-bluelight" />
          <span className="text-[1.4em] font-bold text-shortblack">
            Country-Specific Rates
          </span>
          {countryRates.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-bluelight text-white text-[1.1em] font-semibold">
              {countryRates.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={clsx(
            "w-5 h-5 text-grays transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className=""
          >
            <div className="p-5 space-y-4">
              {/* Info */}
              <p className="text-[1.2em] text-grays">
                Set different CPC rates for specific countries. Default rate ($
                {defaultCpcRate.toFixed(4)}) applies to unlisted countries.
              </p>

              {/* Country List */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {countryRates.length === 0 ? (
                  <p className="text-center text-grays text-[1.2em] py-4 italic">
                    No country rates configured yet
                  </p>
                ) : (
                  countryRates.map((rate) => (
                    <div
                      key={rate.countryCode}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl group hover:border-gray-300 transition-colors"
                    >
                      {/* Flag & Name */}
                      <span className="text-[1.6em]">
                        {getCountryFlag(rate.countryCode)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[1.3em] font-semibold text-shortblack truncate">
                          {rate.countryName}
                        </p>
                        <p className="text-[1.1em] text-grays">
                          {rate.countryCode}
                        </p>
                      </div>

                      {/* CPC Input */}
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grays text-[1.2em]">
                            $
                          </span>
                          <input
                            type="number"
                            step="0.0001"
                            min="0"
                            value={rate.cpcRate}
                            onChange={(e) =>
                              handleUpdateRate(
                                rate.countryCode,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            disabled={disabled}
                            className="w-28 pl-7 pr-2 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none text-[1.2em] text-shortblack font-medium"
                          />
                        </div>
                        <span className="text-[1.1em] text-bluelight font-medium whitespace-nowrap">
                          {formatCPM(rate.cpcRate ?? rate.level1Rate)}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveCountry(rate.countryCode)}
                        disabled={disabled}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Country Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  disabled={disabled || availableCountries.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-grays hover:text-bluelight hover:border-bluelight transition-colors w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-[1.3em] font-medium">Add Country</span>
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 bottom-full mb-2 bg-white rounded-xl border border-gray-200 shadow-xl z-20 overflow-hidden"
                    >
                      {/* Search */}
                      <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grays" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search country..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-bluelight focus:ring-2 focus:ring-bluelight/20 outline-none text-[1.2em]"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Country List */}
                      <div className="max-h-48 overflow-y-auto">
                        {availableCountries.length === 0 ? (
                          <p className="p-4 text-center text-grays text-[1.2em]">
                            {searchQuery
                              ? "No countries found"
                              : "All countries added"}
                          </p>
                        ) : (
                          availableCountries.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() =>
                                handleAddCountry(country.code, country.name)
                              }
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                            >
                              <span className="text-[1.4em]">
                                {country.flag}
                              </span>
                              <span className="text-[1.3em] text-shortblack font-medium">
                                {country.name}
                              </span>
                              <span className="text-[1.1em] text-grays">
                                ({country.code})
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
