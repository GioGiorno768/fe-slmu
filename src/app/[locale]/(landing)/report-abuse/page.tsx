// Server Component - No "use client" for SEO
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import ReportAbuseForm from "@/components/landing/ReportAbuseForm";
import { AnimateOnView } from "@/components/landing/AnimateWrappers";
import { ShieldAlert, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const guidelines = [
  {
    icon: AlertTriangle,
    title: "What Can Be Reported",
    items: [
      "Phishing and scam websites",
      "Malware and virus distribution",
      "Illegal content (gambling, adult material)",
      "Spam and platform abuse",
      "Copyright infringement",
    ],
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    icon: CheckCircle,
    title: "How We Handle Reports",
    items: [
      "Reports are reviewed within 24 hours",
      "Our team investigates each case",
      "Harmful links are blocked immediately",
      "You'll be contacted if more info is needed",
    ],
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
];

export default function ReportAbuse() {
  return (
    <main className="min-h-screen bg-white font-poppins">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-blue-50/40 to-transparent"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bluelanding/10 text-bluelanding text-sm font-medium mb-6">
              <ShieldAlert className="w-4 h-4" />
              Security
            </div>
          </AnimateOnView>

          <AnimateOnView delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-800 mb-5 tracking-tight">
              Report <span className="text-bluelanding">Abuse</span>
            </h1>
          </AnimateOnView>

          <AnimateOnView delay={0.2}>
            <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed font-light font-figtree">
              Found a suspicious or harmful link? Report it here and help us
              keep the platform safe.
            </p>
          </AnimateOnView>
        </div>
      </section>

      {/* Guidelines */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidelines.map((guide, index) => (
              <AnimateOnView key={guide.title} delay={index * 0.1}>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 ${guide.iconBg} rounded-xl flex items-center justify-center ${guide.iconColor}`}
                    >
                      <guide.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-800">
                      {guide.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {guide.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-slate-500"
                      >
                        <span className="text-bluelanding mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnView>
            ))}
          </div>

          {/* Response time info */}
          <AnimateOnView>
            <div className="flex items-center justify-center gap-3 mt-8 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>Average response time: within 24 hours</span>
            </div>
          </AnimateOnView>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16 bg-slate-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnView>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-3">
                Submit a Report
              </h2>
              <p className="text-slate-500 font-light font-figtree">
                Fill out the form below to report a suspicious link
              </p>
            </div>
          </AnimateOnView>

          <AnimateOnView>
            <ReportAbuseForm />
          </AnimateOnView>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
