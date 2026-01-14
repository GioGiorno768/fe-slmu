"use client";

import { useState, useEffect } from "react";
import { Globe, Loader2, TrendingUp } from "lucide-react";
import apiClient from "@/services/apiClient";
import { useTheme } from "next-themes";
import clsx from "clsx";

interface CountryData {
  code: string;
  name: string;
  views: number;
  percentage: number;
}

interface TopCountriesResponse {
  countries: CountryData[];
  total_views: number;
}

// Country flag emoji mapping
const getCountryFlag = (code: string): string => {
  if (code === "OTHER") return "🌍";
  // Convert country code to flag emoji
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default function TopCountriesCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TopCountriesResponse | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/admin/analytics/top-countries");
        const apiData = response.data.data;

        // Map API response to our interface
        const countries: CountryData[] = (apiData.items || []).map(
          (item: any) => ({
            code: item.country_code,
            name: item.country_name,
            views: item.views,
            percentage: item.percentage,
          })
        );

        setData({
          countries,
          total_views: apiData.total_views || 0,
        });
      } catch (error) {
        console.error("Failed to fetch top countries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Color palette for progress bars
  const getBarColor = (index: number): string => {
    const colors = [
      "bg-blue-500",
      "bg-emerald-500",
      "bg-violet-500",
      "bg-amber-500",
      "bg-rose-500",
      "bg-cyan-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-pink-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div
      className={clsx(
        "p-6 rounded-3xl shadow-sm border font-figtree",
        isDark ? "bg-card border-gray-800" : "bg-white border-gray-100"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className={clsx(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isDark ? "bg-emerald-500/20" : "bg-emerald-100"
          )}
        >
          <Globe
            className={clsx(
              "w-5 h-5",
              isDark ? "text-emerald-400" : "text-emerald-600"
            )}
          />
        </div>
        <div>
          <h3
            className={clsx(
              "text-[1.6em] font-bold",
              isDark ? "text-white" : "text-slate-800"
            )}
          >
            Top Countries
          </h3>
          <p
            className={clsx(
              "text-[1.1em]",
              isDark ? "text-gray-400" : "text-slate-400"
            )}
          >
            Visitor locations worldwide
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-200" />
          </div>
        ) : data && data.countries.length > 0 ? (
          <>
            {/* Total Views */}
            <div
              className={clsx(
                "flex items-center gap-2 mb-4 p-3 rounded-xl",
                isDark ? "bg-emerald-500/20" : "bg-emerald-50"
              )}
            >
              <TrendingUp
                className={clsx(
                  "w-4 h-4",
                  isDark ? "text-emerald-400" : "text-emerald-600"
                )}
              />
              <span
                className={clsx(
                  "text-[1.2em] font-medium",
                  isDark ? "text-emerald-400" : "text-emerald-700"
                )}
              >
                {data.total_views.toLocaleString("en-US")} total views
              </span>
            </div>

            {/* Country List */}
            <div
              onWheel={(e) => e.stopPropagation()}
              className="space-y-3 max-h-[190px] overflow-y-auto pr-2"
            >
              {data.countries.map((country, index) => (
                <div key={country.code} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[1.4em]">
                        {getCountryFlag(country.code)}
                      </span>
                      <span
                        className={clsx(
                          "text-[1.2em] font-medium",
                          isDark ? "text-white" : "text-slate-700"
                        )}
                      >
                        {country.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          "text-[1.1em]",
                          isDark ? "text-gray-400" : "text-slate-500"
                        )}
                      >
                        {country.views.toLocaleString("en-US")}
                      </span>
                      <span
                        className={clsx(
                          "text-[1.1em] font-semibold",
                          isDark ? "text-white" : "text-slate-700"
                        )}
                      >
                        {country.percentage}%
                      </span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div
                    className={clsx(
                      "h-2 rounded-full overflow-hidden",
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    )}
                  >
                    <div
                      className={`h-full ${getBarColor(
                        index
                      )} rounded-full transition-all duration-500`}
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div
            className={clsx(
              "h-[250px] flex flex-col items-center justify-center",
              isDark ? "text-gray-400" : "text-slate-400"
            )}
          >
            <Globe className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-[1.2em]">No country data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
