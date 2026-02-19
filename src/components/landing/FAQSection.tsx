// Server Component - SEO friendly
import FeaturesClient from "./FeaturesClient";
import FAQAccordion from "./FAQAccordion";
import { getTranslations } from "next-intl/server";

export default async function FAQSection() {
  const t = await getTranslations("Landing.FAQ");

  const faqs = [
    { question: t("q1.question"), answer: t("q1.answer") },
    { question: t("q2.question"), answer: t("q2.answer") },
    { question: t("q3.question"), answer: t("q3.answer") },
    { question: t("q4.question"), answer: t("q4.answer") },
    { question: t("q5.question"), answer: t("q5.answer") },
    { question: t("q6.question"), answer: t("q6.answer") },
  ];

  return (
    <section id="faq" className="py-20 md:py-28 bg-white font-poppins">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - SSR rendered for SEO */}
        <div className="text-center mb-12 md:mb-14">
          <FeaturesClient>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-tight mb-3 text-slate-800">
              {t("title")}{" "}
              <span className="text-bluelanding">{t("titleHighlight")}</span>
            </h2>
          </FeaturesClient>
          <FeaturesClient delay={0.1}>
            <p className="text-slate-500 text-base md:text-lg font-light">
              {t("subtitle")}
            </p>
          </FeaturesClient>
        </div>

        {/* FAQ Accordion - Client component for interactivity */}
        <FAQAccordion faqs={faqs} />
      </div>
    </section>
  );
}
