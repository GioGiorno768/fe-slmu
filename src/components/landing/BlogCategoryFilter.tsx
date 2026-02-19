"use client";

import { motion } from "motion/react";

interface BlogCategoryFilterProps {
  categories: { key: string; label: string }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function BlogCategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: BlogCategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onCategoryChange(cat.key)}
          className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
            activeCategory === cat.key
              ? "text-white"
              : "text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100"
          }`}
        >
          {activeCategory === cat.key && (
            <motion.div
              layoutId="activeCategoryBlog"
              className="absolute inset-0 bg-bluelanding rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            />
          )}
          <span className="relative z-10">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
