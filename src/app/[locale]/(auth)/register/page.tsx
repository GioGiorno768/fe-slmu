import type { Metadata } from "next";
import AuthBranding from "@/components/auth/AuthBranding";
import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import RegisterForm from "@/components/auth/RegisterForm";
import AuthPageCheck from "@/components/auth/AuthPageCheck";
import RegistrationCheck from "@/components/auth/RegistrationCheck";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata.register");
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: "https://shortlinkmu.com/register",
    },
    twitter: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    alternates: {
      canonical: "https://shortlinkmu.com/register",
      languages: {
        "id-ID": "https://shortlinkmu.com/id/register",
        "en-US": "https://shortlinkmu.com/en/register",
      },
    },
  };
}

export default function RegisterPage() {
  return (
    <RegistrationCheck>
      <AuthPageCheck>
        <main className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2 font-figtree bg-white">
          <AuthBranding accentColor="purple" />
          <AuthFormWrapper allowScroll>
            <RegisterForm />
          </AuthFormWrapper>
        </main>
      </AuthPageCheck>
    </RegistrationCheck>
  );
}
