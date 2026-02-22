import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import BlogArticleContent from "@/components/landing/BlogArticleContent";
import { getTranslations, getLocale } from "next-intl/server";

interface ArticleMeta {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: number;
}

interface Section {
  heading: string;
  paragraphs: string[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations("Landing.Blog");
  const locale = await getLocale();
  const articles = t.raw("articles") as ArticleMeta[];
  const article = articles.find((a) => a.slug === slug);

  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | Shortlinkmu`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | Shortlinkmu`,
      description: article.excerpt,
      url: `https://shortlinkmu.com/${locale}/blog/${slug}`,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
    },
    twitter: {
      title: article.title,
      description: article.excerpt,
    },
    alternates: {
      canonical: `https://shortlinkmu.com/${locale}/blog/${slug}`,
      languages: {
        "id-ID": `https://shortlinkmu.com/id/blog/${slug}`,
        "en-US": `https://shortlinkmu.com/en/blog/${slug}`,
        "x-default": `https://shortlinkmu.com/en/blog/${slug}`,
      },
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const t = await getTranslations("Landing.Blog");

  // Get article metadata
  const articles = t.raw("articles") as ArticleMeta[];
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Get article body content
  const articleDetails = t.raw("articleDetails") as Record<
    string,
    { sections: Section[] }
  >;
  const details = articleDetails[slug];

  if (!details) {
    notFound();
  }

  // Get related articles (same category, excluding current)
  const relatedArticles = articles
    .filter((a) => a.category === article.category && a.slug !== slug)
    .slice(0, 3);

  // If not enough same-category articles, fill with other articles
  if (relatedArticles.length < 3) {
    const otherArticles = articles
      .filter(
        (a) =>
          a.slug !== slug && !relatedArticles.find((r) => r.slug === a.slug),
      )
      .slice(0, 3 - relatedArticles.length);
    relatedArticles.push(...otherArticles);
  }

  // ── JSON-LD Structured Data ──
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Organization",
      name: article.author,
      url: "https://shortlinkmu.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Shortlinkmu",
      url: "https://shortlinkmu.com",
      logo: {
        "@type": "ImageObject",
        url: "https://shortlinkmu.com/landing/logo.svg",
      },
    },
    datePublished: article.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://shortlinkmu.com/blog/${slug}`,
    },
    image: "https://shortlinkmu.com/og-image.png",
    wordCount: details.sections.reduce(
      (acc, s) => acc + s.paragraphs.join(" ").split(/\s+/).length,
      0,
    ),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://shortlinkmu.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://shortlinkmu.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://shortlinkmu.com/blog/${slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white font-poppins">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <BlogArticleContent
        article={article}
        sections={details.sections}
        relatedArticles={relatedArticles}
      />
      <Footer />
    </main>
  );
}
