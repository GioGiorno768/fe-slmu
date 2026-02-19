"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import BlogCategoryFilter from "@/components/landing/BlogCategoryFilter";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  Clock,
  ArrowRight,
  User,
  Calendar,
  Sparkles,
} from "lucide-react";

interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: number;
}

const categoryColors: Record<
  string,
  { bg: string; text: string; gradient: string }
> = {
  tutorial: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    gradient: "from-blue-500 to-indigo-600",
  },
  tips: {
    bg: "bg-green-50",
    text: "text-green-600",
    gradient: "from-green-500 to-emerald-600",
  },
  seo: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    gradient: "from-orange-500 to-amber-600",
  },
  monetize: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    gradient: "from-purple-500 to-violet-600",
  },
  updates: {
    bg: "bg-pink-50",
    text: "text-pink-600",
    gradient: "from-pink-500 to-rose-600",
  },
};

export default function BlogContent() {
  const t = useTranslations("Landing.Blog");
  const [activeCategory, setActiveCategory] = useState("all");

  const articles = t.raw("articles") as Article[];

  const categories = [
    { key: "all", label: t("allCategories") },
    { key: "tutorial", label: t("category_tutorial") },
    { key: "tips", label: t("category_tips") },
    { key: "seo", label: t("category_seo") },
    { key: "monetize", label: t("category_monetize") },
    { key: "updates", label: t("category_updates") },
  ];

  const filteredArticles =
    activeCategory === "all"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const getCategoryLabel = (key: string) => {
    const cat = categories.find((c) => c.key === key);
    return cat?.label || key;
  };

  return (
    <>
      {/* Category Filter */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogCategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredArticles.map((article, index) => {
                const colors =
                  categoryColors[article.category] || categoryColors.tutorial;
                return (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group"
                  >
                    <motion.article
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.4 }}
                      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full"
                    >
                      {/* Card Cover */}
                      <div
                        className={`relative h-44 bg-gradient-to-br ${colors.gradient} overflow-hidden`}
                      >
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full" />
                          <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white rounded-lg rotate-45" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/30 rounded-full" />
                        </div>

                        {/* Category badge */}
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                            <BookOpen className="w-3 h-3" />
                            {getCategoryLabel(article.category)}
                          </span>
                        </div>

                        {/* Read time */}
                        <div className="absolute bottom-4 right-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-sm text-white text-xs">
                            <Clock className="w-3 h-3" />
                            {article.readTime} {t("minRead")}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-bluelanding transition-colors duration-200">
                          {article.title}
                        </h3>

                        <p className="text-sm text-slate-500 font-figtree leading-relaxed mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>

                        {/* Author & Date */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-bluelanding/10 flex items-center justify-center">
                              <User className="w-3 h-3 text-bluelanding" />
                            </div>
                            <span className="text-xs text-slate-400 font-figtree">
                              {article.author}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {article.date}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 font-figtree">
                No articles found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-bluelanding to-purple-800 rounded-3xl p-10 md:p-14 text-center overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-xl" />
            </div>

            <div className="relative z-10">
              <Sparkles className="w-8 h-8 text-yellow-300 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                {t("cta.title")}
              </h2>
              <p className="text-white/70 font-figtree mb-6 max-w-lg mx-auto">
                {t("cta.subtitle")}
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white text-bluelanding font-semibold px-7 py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-lg"
              >
                {t("cta.button")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
