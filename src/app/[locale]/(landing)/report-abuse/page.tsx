// Server Component - SEO friendly
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import ReportAbuseForm from "@/components/landing/ReportAbuseForm";
import { AnimateOnView } from "@/components/landing/AnimateWrappers";
import { ShieldAlert, AlertTriangle, CheckCircle } from "lucide-react";

const guidelines = [
  {
    icon: AlertTriangle,
    title: "Apa yang Bisa Dilaporkan?",
    items: [
      "Phishing dan penipuan",
      "Malware dan virus",
      "Konten ilegal (judi, pornografi)",
      "Spam dan penyalahgunaan",
      "Pelanggaran hak cipta",
    ],
    color: "bg-red-50 text-red-600",
  },
  {
    icon: CheckCircle,
    title: "Proses Penanganan",
    items: [
      "Laporan diterima dalam 24 jam",
      "Tim kami akan meninjau laporan",
      "Link berbahaya akan diblokir",
      "Anda akan dihubungi jika perlu",
    ],
    color: "bg-green-50 text-green-600",
  },
];

export default function ReportAbuse() {
  return (
    <main className="min-h-screen bg-white font-figtree">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 to-red-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldAlert className="w-4 h-4" />
              Security
            </div>
          </AnimateOnView>
          <AnimateOnView delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Report Abuse
            </h1>
          </AnimateOnView>
          <AnimateOnView delay={0.2}>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Kami menangani penyalahgunaan dengan serius. Jika Anda menemukan
              link yang mencurigakan atau berbahaya, laporkan di sini.
            </p>
          </AnimateOnView>
        </div>
      </section>

      {/* Guidelines */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidelines.map((guide, index) => (
              <AnimateOnView key={guide.title} delay={index * 0.1}>
                <div className="bg-slate-50 rounded-2xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2 rounded-lg ${guide.color.split(" ")[0]}`}
                    >
                      <guide.icon
                        className={`w-5 h-5 ${guide.color.split(" ")[1]}`}
                      />
                    </div>
                    <h3 className="font-bold text-slate-900">{guide.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {guide.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <span className="text-bluelight mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
