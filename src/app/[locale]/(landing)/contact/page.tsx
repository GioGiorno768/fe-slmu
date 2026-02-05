// Server Component - No "use client" for SEO
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { AnimateOnView } from "@/components/landing/AnimateWrappers";
import {
  Mail,
  MessageCircle,
  Headphones,
  Clock,
  Send,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";

const contactMethods = [
  {
    icon: Headphones,
    title: "General Support",
    description: "For general questions, technical issues, or account help",
    email: "support@shortlinkmu.com",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Mail,
    title: "Billing & Payout",
    description: "For payment questions, withdrawals, or partnerships",
    email: "billing@shortlinkmu.com",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
];

const quickInfo = [
  {
    icon: Clock,
    title: "Response Time",
    description: "Within 24 hours",
  },
  {
    icon: MessageCircle,
    title: "Support Hours",
    description: "Mon - Fri, 9AM - 5PM",
  },
];

export default function Contact() {
  return (
    <main className="min-h-screen bg-white font-poppins">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-blue-50/60 to-transparent"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bluelanding/10 text-bluelanding text-sm font-medium mb-6">
              <Send className="w-4 h-4" />
              Contact Us
            </div>
          </AnimateOnView>

          <AnimateOnView delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-800 mb-5 tracking-tight">
              Get in <span className="text-bluelanding">Touch</span>
            </h1>
          </AnimateOnView>

          <AnimateOnView delay={0.2}>
            <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed font-light font-figtree">
              Have a question or need help? Our support team is ready to assist
              you.
            </p>
          </AnimateOnView>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactMethods.map((method, index) => (
              <AnimateOnView key={method.title} delay={index * 0.1}>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div
                    className={`w-12 h-12 ${method.iconBg} rounded-xl mb-4 flex items-center justify-center ${method.iconColor}`}
                  >
                    <method.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-5 font-figtree">
                    {method.description}
                  </p>
                  <a
                    href={`mailto:${method.email}`}
                    className="inline-flex items-center gap-2 w-full justify-center bg-bluelanding text-white font-medium py-3 px-5 rounded-xl hover:bg-blue-600 transition-all text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
                  </a>
                </div>
              </AnimateOnView>
            ))}
          </div>

          {/* Quick Info */}
          <AnimateOnView>
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {quickInfo.map((info) => (
                <div
                  key={info.title}
                  className="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-xl"
                >
                  <info.icon className="w-5 h-5 text-bluelanding" />
                  <div>
                    <p className="text-xs text-slate-400">{info.title}</p>
                    <p className="text-sm font-medium text-slate-700">
                      {info.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnView>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-slate-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnView>
            <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm text-center">
              <div className="w-14 h-14 bg-bluelanding/10 rounded-2xl mx-auto mb-5 flex items-center justify-center">
                <HelpCircle className="w-7 h-7 text-bluelanding" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-3">
                Check Our FAQ
              </h2>
              <p className="text-slate-500 font-light mb-6 max-w-md mx-auto font-figtree">
                Your question might already be answered in our frequently asked
                questions
              </p>
              <Link
                href="/#faq"
                className="inline-flex items-center gap-2 bg-bluelanding text-white font-medium py-3 px-6 rounded-xl hover:bg-blue-600 transition-all group"
              >
                View FAQ
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </AnimateOnView>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
