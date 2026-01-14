"use client";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import clsx from "clsx";
import { useTheme } from "next-themes";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) return null;

  // Nav button styles
  const navButtonClass = clsx(
    "p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-grays",
    isDark
      ? "border border-gray-700 hover:bg-gray-dashboard/50 hover:text-gray-200"
      : "border border-gray-200 hover:bg-gray-50"
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
      {/* First Page */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={navButtonClass}
        aria-label="First Page"
      >
        <ChevronsLeft className="w-5 h-5" />
      </button>

      {/* Previous Page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={navButtonClass}
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex flex-wrap items-center justify-center gap-1 mx-2">
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={clsx(
              "w-10 h-10 rounded-lg text-[1.1em] font-bold transition-all",
              page === currentPage
                ? isDark
                  ? "bg-bluelight text-white shadow-lg shadow-purple-900/30"
                  : "bg-bluelight text-white shadow-lg shadow-blue-200"
                : page === "..."
                ? "cursor-default text-grays"
                : isDark
                ? "text-grays hover:bg-gray-dashboard/50 hover:text-gray-200"
                : "text-grays hover:bg-gray-50 hover:text-shortblack"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={navButtonClass}
        aria-label="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Last Page */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={navButtonClass}
        aria-label="Last Page"
      >
        <ChevronsRight className="w-5 h-5" />
      </button>
    </div>
  );
}
