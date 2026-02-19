"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  BookOpen,
  List,
  Share2,
  Copy,
  Check,
  Twitter,
  Facebook,
  ArrowRight,
} from "lucide-react";

interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

interface ArticleMeta {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: number;
}

interface BlogArticleContentProps {
  article: ArticleMeta;
  sections: ArticleSection[];
  relatedArticles: ArticleMeta[];
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

export default function BlogArticleContent({
  article,
  sections,
  relatedArticles,
}: BlogArticleContentProps) {
  const t = useTranslations("Landing.Blog");
  const [activeSection, setActiveSection] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const articleRef = useRef<HTMLElement>(null);

  const colors = categoryColors[article.category] || categoryColors.tutorial;

  const categories: Record<string, string> = {
    tutorial: t("category_tutorial"),
    tips: t("category_tips"),
    seo: t("category_seo"),
    monetize: t("category_monetize"),
    updates: t("category_updates"),
  };

  // Set current URL after mount (avoids hydration mismatch)
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      const el = articleRef.current;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(100, (scrolled / total) * 100);
      setReadingProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(
              entry.target as HTMLElement,
            );
            if (index !== -1) setActiveSection(index);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" },
    );
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, [sections]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setTocOpen(false);
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-100">
        <motion.div
          className={`h-full bg-gradient-to-r ${colors.gradient}`}
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Back to Blog */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-bluelanding transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t("backToBlog")}
        </Link>
      </div>

      {/* Article Header */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          {/* Category badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} mb-5`}
          >
            <BookOpen className="w-3 h-3" />
            {categories[article.category] || article.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-800 leading-tight mb-6 tracking-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-slate-500 font-figtree leading-relaxed mb-8">
            {article.excerpt}
          </p>

          {/* Author bar */}
          <div className="flex flex-wrap items-center gap-4 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-bluelanding to-indigo-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {article.author}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime} {t("minRead")}
            </div>
          </div>
        </motion.div>
      </header>

      {/* Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex gap-10">
          {/* Sidebar TOC — Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-40">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <List className="w-3.5 h-3.5" />
                {t("tableOfContents")}
              </h3>
              <nav className="space-y-1">
                {sections.map((section, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToSection(i)}
                    className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-200 cursor-pointer ${
                      activeSection === i
                        ? `${colors.bg} ${colors.text} font-medium`
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {section.heading}
                  </button>
                ))}
              </nav>

              {/* Share */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5" />
                  {t("shareArticle")}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                    title="Copy link"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile TOC Toggle */}
          <div className="fixed bottom-6 right-6 lg:hidden z-40">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className={`p-3.5 rounded-full shadow-lg transition-all duration-200 cursor-pointer ${
                tocOpen
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile TOC Panel */}
          <AnimatePresence>
            {tocOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-20 right-6 z-40 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 lg:hidden"
              >
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {t("tableOfContents")}
                </h3>
                <nav className="space-y-1 max-h-64 overflow-y-auto">
                  {sections.map((section, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToSection(i)}
                      className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all cursor-pointer ${
                        activeSection === i
                          ? `${colors.bg} ${colors.text} font-medium`
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {section.heading}
                    </button>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Article Body */}
          <article ref={articleRef} className="flex-1 min-w-0">
            <div className="prose prose-slate max-w-none">
              {sections.map((section, i) => (
                <motion.section
                  key={i}
                  ref={(el) => {
                    sectionRefs.current[i] = el;
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-10"
                >
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-4 tracking-tight">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((p, j) => (
                    <p
                      key={j}
                      className="text-base text-slate-600 font-figtree leading-relaxed mb-4"
                    >
                      {p}
                    </p>
                  ))}
                </motion.section>
              ))}
            </div>
          </article>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="pb-20 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-semibold text-slate-800 mb-8">
              {t("relatedArticles")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related, index) => {
                const relColors =
                  categoryColors[related.category] || categoryColors.tutorial;
                return (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      <div
                        className={`h-32 bg-gradient-to-br ${relColors.gradient} relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-3 right-3 w-14 h-14 border-2 border-white rounded-full" />
                          <div className="absolute bottom-3 left-3 w-8 h-8 border-2 border-white rounded-lg rotate-45" />
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium">
                            <BookOpen className="w-2.5 h-2.5" />
                            {categories[related.category] || related.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-slate-800 group-hover:text-bluelanding transition-colors line-clamp-2 mb-2">
                          {related.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          {related.readTime} {t("minRead")}
                          <span className="mx-1">·</span>
                          {related.date}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-bluelanding to-purple-800 rounded-3xl p-10 md:p-14 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-xl" />
            </div>
            <div className="relative z-10">
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
