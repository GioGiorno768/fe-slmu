// Server Component - No "use client" for SEO
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { AnimateOnView } from "@/components/landing/AnimateWrappers";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";

const sections = [
  {
    id: "collection",
    title: "1. Information We Collect",
    content: `We collect information to provide and improve our services. The types of information we collect include:`,
    subsections: [
      {
        title: "Personal Information",
        items: [
          "Email address and username during registration",
          "Payment information for processing withdrawals",
          "Profile information you choose to provide",
        ],
      },
      {
        title: "Usage Data",
        items: [
          "IP addresses of visitors clicking your links",
          "Browser type, device information, and operating system",
          "Pages visited, time spent, and referral sources",
          "Click patterns and geographic location data",
        ],
      },
      {
        title: "Technical Data",
        items: [
          "URLs you submit for shortening",
          "Analytics and performance metrics",
          "Log files and error reports",
        ],
      },
    ],
  },
  {
    id: "use",
    title: "2. How We Use Your Information",
    content: `We use the collected information for the following purposes:`,
    list: [
      "To provide, operate, and maintain our URL shortening service",
      "To process your account registration and authenticate users",
      "To calculate and process your earnings and payouts",
      "To send you service updates, security alerts, and support messages",
      "To detect, prevent, and address fraud, abuse, and technical issues",
      "To analyze usage patterns and improve our services",
      "To comply with legal obligations and enforce our terms",
    ],
  },
  {
    id: "sharing",
    title: "3. Information Sharing",
    content: `We do not sell your personal information. We may share information in the following circumstances:`,
    list: [
      "With payment processors to facilitate withdrawals",
      "With service providers who assist in operating our platform",
      "When required by law or to respond to legal process",
      "To protect our rights, privacy, safety, or property",
      "In connection with a merger, acquisition, or sale of assets",
    ],
    note: "Third-party service providers are contractually bound to protect your data.",
  },
  {
    id: "cookies",
    title: "4. Cookies and Tracking Technologies",
    content: `We use cookies and similar technologies to enhance your experience:`,
    list: [
      "Essential cookies for authentication and security",
      "Analytics cookies to understand how users interact with our service",
      "Preference cookies to remember your settings",
    ],
    note: "You can control cookies through your browser settings. Disabling certain cookies may affect functionality.",
  },
  {
    id: "security",
    title: "5. Data Security",
    content: `We implement industry-standard security measures to protect your information:`,
    list: [
      "Encryption of data in transit using SSL/TLS",
      "Secure storage of passwords using hashing algorithms",
      "Regular security audits and vulnerability assessments",
      "Access controls limiting who can view your data",
    ],
    note: "While we strive to protect your data, no method of transmission over the Internet is 100% secure.",
  },
  {
    id: "retention",
    title: "6. Data Retention",
    content: `We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specifically:`,
    list: [
      "Account data is retained while your account is active",
      "Usage and analytics data is retained for up to 24 months",
      "Financial records are retained as required by law",
      "You may request deletion of your account and associated data",
    ],
  },
  {
    id: "rights",
    title: "7. Your Rights",
    content: `Depending on your location, you may have the following rights:`,
    list: [
      "Access and obtain a copy of your personal data",
      "Correct inaccurate or incomplete information",
      "Request deletion of your personal data",
      "Object to or restrict certain processing activities",
      "Data portability to receive your data in a structured format",
      "Withdraw consent where processing is based on consent",
    ],
    note: "To exercise these rights, please contact us through our contact page.",
  },
  {
    id: "children",
    title: "8. Children's Privacy",
    content: `Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.`,
  },
  {
    id: "international",
    title: "9. International Data Transfers",
    content: `Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our service, you consent to such transfers. We take appropriate safeguards to ensure your data remains protected.`,
  },
  {
    id: "thirdparty",
    title: "10. Third-Party Links",
    content: `Our service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read the privacy policies of any third-party sites you visit through shortened links.`,
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of the service after changes constitutes acceptance of the updated policy.`,
  },
  {
    id: "contact",
    title: "12. Contact Us",
    content: `If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@shortlinkmu.com or through our contact page.`,
    hasLink: true,
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white font-poppins">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-blue-50/60 to-transparent"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bluelanding/10 text-bluelanding text-sm font-medium mb-6">
              <ShieldCheck className="w-4 h-4" />
              Legal
            </div>
          </AnimateOnView>

          <AnimateOnView delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-800 mb-5 tracking-tight">
              Privacy Policy
            </h1>
          </AnimateOnView>

          <AnimateOnView delay={0.2}>
            <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed font-light font-figtree">
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your data.
            </p>
          </AnimateOnView>

          <AnimateOnView delay={0.3}>
            <p className="text-sm text-slate-400 mt-4">
              Last updated: February 5, 2026
            </p>
          </AnimateOnView>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnView>
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-50 rounded-lg hover:bg-bluelanding hover:text-white transition-all"
                >
                  {section.title.split(". ")[1]}
                </a>
              ))}
            </div>
          </AnimateOnView>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <AnimateOnView key={section.id} delay={0.05}>
                <div
                  id={section.id}
                  className="scroll-mt-24 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow font-figtree"
                >
                  <h2 className="text-xl font-semibold text-slate-800 mb-3">
                    {section.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed font-figtree">
                    {section.content}
                  </p>

                  {section.subsections && (
                    <div className="mt-4 space-y-4">
                      {section.subsections.map((sub, i) => (
                        <div key={i} className="bg-slate-50 rounded-lg p-4">
                          <h4 className="font-medium text-slate-700 mb-2">
                            {sub.title}
                          </h4>
                          <ul className="space-y-1">
                            {sub.items.map((item, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm text-slate-600"
                              >
                                <span className="text-bluelanding mt-0.5">
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.list && (
                    <ul className="mt-4 space-y-2 ml-4">
                      {section.list.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-slate-600"
                        >
                          <span className="text-bluelanding mt-1 text-sm">
                            •
                          </span>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.note && (
                    <p className="mt-4 text-sm text-slate-500 italic bg-slate-50 px-4 py-3 rounded-lg">
                      {section.note}
                    </p>
                  )}

                  {section.hasLink && (
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 mt-4 text-bluelanding font-medium hover:underline group"
                    >
                      Contact Us
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}

                  {index < sections.length - 1 && (
                    <div className="border-b border-slate-100 mt-8"></div>
                  )}
                </div>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
