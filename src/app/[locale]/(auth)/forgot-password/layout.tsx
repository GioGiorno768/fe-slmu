import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata.forgotPassword");
  const locale = await getLocale();
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `https://shortlinkmu.com/${locale}/forgot-password`,
    },
    twitter: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    alternates: {
      canonical: `https://shortlinkmu.com/${locale}/forgot-password`,
      languages: {
        "id-ID": "https://shortlinkmu.com/id/forgot-password",
        "en-US": "https://shortlinkmu.com/en/forgot-password",
      },
    },
  };
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
