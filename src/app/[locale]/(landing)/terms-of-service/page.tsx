// Server Component - No "use client" for SEO
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { AnimateOnView } from "@/components/landing/AnimateWrappers";
import { FileText, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using Shortlinkmu ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Service. These terms apply to all users, including visitors, registered users, and publishers.`,
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: `To use our Service, you must be at least 18 years old or have parental consent. By using the Service, you represent and warrant that you meet these eligibility requirements and have the legal capacity to enter into these Terms.`,
  },
  {
    id: "account",
    title: "3. Account Registration",
    content: `When you create an account, you agree to:`,
    list: [
      "Provide accurate, current, and complete information",
      "Maintain the security of your password and account",
      "Accept responsibility for all activities under your account",
      "Notify us immediately of any unauthorized access",
    ],
    note: "We reserve the right to suspend or terminate accounts that violate these terms.",
  },
  {
    id: "service",
    title: "4. Service Description",
    content: `Shortlinkmu provides URL shortening services that allow users to create shortened links and earn revenue based on legitimate visitor traffic. We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without prior notice.`,
  },
  {
    id: "prohibited",
    title: "5. Prohibited Uses",
    content: `You agree not to use the Service for:`,
    list: [
      "Creating links to illegal, harmful, or malicious content",
      "Distributing malware, viruses, or phishing schemes",
      "Generating fraudulent or artificial traffic (bots, auto-clicks)",
      "Promoting violence, hate speech, or discriminatory content",
      "Infringing on intellectual property rights",
      "Spamming or unsolicited bulk messaging",
      "Any activity that violates applicable laws or regulations",
    ],
    note: "Violation of these rules may result in immediate account termination and forfeiture of earnings.",
  },
  {
    id: "earnings",
    title: "6. Earnings and Payments",
    content: `Publishers earn revenue based on legitimate views of their shortened links. Payment terms:`,
    list: [
      "Earnings are calculated based on our published CPM rates",
      "Rates may vary based on traffic location and quality",
      "Minimum payout thresholds apply as specified on our platform",
      "We reserve the right to withhold payment for suspicious activity",
      "Earnings from fraudulent traffic will be forfeited",
    ],
  },
  {
    id: "intellectual",
    title: "7. Intellectual Property",
    content: `All content, trademarks, and intellectual property related to the Service are owned by Shortlinkmu. You may not copy, modify, distribute, or create derivative works without our written permission. You retain ownership of content you share through our Service.`,
  },
  {
    id: "disclaimer",
    title: "8. Disclaimer of Warranties",
    content: `The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free. We disclaim all warranties including merchantability, fitness for a particular purpose, and non-infringement.`,
  },
  {
    id: "limitation",
    title: "9. Limitation of Liability",
    content: `To the maximum extent permitted by law, Shortlinkmu shall not be liable for:`,
    list: [
      "Any indirect, incidental, or consequential damages",
      "Loss of profits, revenue, data, or business opportunities",
      "Service interruptions or system failures",
      "Actions of third parties using the Service",
      "Damages exceeding the amount paid to you in the past 12 months",
    ],
  },
  {
    id: "indemnification",
    title: "10. Indemnification",
    content: `You agree to indemnify and hold harmless Shortlinkmu, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the Service, violation of these Terms, or infringement of any rights of another party.`,
  },
  {
    id: "termination",
    title: "11. Termination",
    content: `We may terminate or suspend your account at any time, with or without cause, with or without notice. Upon termination, your right to use the Service will immediately cease. Provisions that by their nature should survive termination shall survive.`,
  },
  {
    id: "changes",
    title: "12. Changes to Terms",
    content: `We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page. Your continued use of the Service after changes constitutes acceptance of the new Terms.`,
  },
  {
    id: "governing",
    title: "13. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of the Republic of Indonesia, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Jakarta, Indonesia.`,
  },
  {
    id: "contact",
    title: "14. Contact Information",
    content: `If you have any questions about these Terms of Service, please contact us through our contact page or email us at legal@shortlinkmu.com.`,
    hasLink: true,
  },
];

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white font-poppins">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-slate-50 to-transparent"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              Legal
            </div>
          </AnimateOnView>

          <AnimateOnView delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-800 mb-5 tracking-tight">
              Terms of Service
            </h1>
          </AnimateOnView>

          <AnimateOnView delay={0.2}>
            <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed font-light font-figtree">
              Please read these terms carefully before using our service
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
                  className="scroll-mt-24 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-xl font-semibold text-slate-800 mb-3">
                    {section.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed font-figtree">
                    {section.content}
                  </p>

                  {section.list && (
                    <ul className="mt-4 space-y-2 ml-4">
                      {section.list.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-slate-600 font-figtree"
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
                    <p className="mt-4 text-sm text-slate-500 italic bg-slate-50 px-4 py-3 rounded-lg font-figtree">
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
