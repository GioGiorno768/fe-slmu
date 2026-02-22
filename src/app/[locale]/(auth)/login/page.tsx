import type { Metadata } from "next";
import AuthBranding from "@/components/auth/AuthBranding";
import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import LoginForm from "@/components/auth/LoginForm";
import AuthPageCheck from "@/components/auth/AuthPageCheck";
import LoginCheck from "@/components/auth/LoginCheck";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata.login");
  const locale = await getLocale();
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `https://shortlinkmu.com/${locale}/login`,
    },
    twitter: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    alternates: {
      canonical: `https://shortlinkmu.com/${locale}/login`,
      languages: {
        "id-ID": "https://shortlinkmu.com/id/login",
        "en-US": "https://shortlinkmu.com/en/login",
        "x-default": "https://shortlinkmu.com/en/login",
      },
    },
  };
}

export default function LoginPage() {
  return (
    <LoginCheck>
      <AuthPageCheck>
        <main className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2 font-figtree bg-white">
          <AuthBranding accentColor="blue" />
          <AuthFormWrapper allowScroll>
            <LoginForm />
          </AuthFormWrapper>
        </main>
      </AuthPageCheck>
    </LoginCheck>
  );
}
