// Server Component - SEO friendly
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { AnimateOnView } from "@/components/landing/AnimateWrappers";
import {
  FileText,
  Scale,
  Shield,
  AlertTriangle,
  Users,
  RefreshCw,
  Mail,
} from "lucide-react";
import { Link } from "@/i18n/routing";

const sections = [
  {
    id: 1,
    icon: Scale,
    title: "1. Penerimaan Persyaratan",
    content: `Dengan mengakses atau menggunakan Layanan kami, Anda setuju untuk terikat oleh Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, maka Anda tidak diizinkan untuk mengakses Layanan.`,
  },
  {
    id: 2,
    icon: AlertTriangle,
    title: "2. Penggunaan Layanan",
    content: `Anda setuju untuk tidak menggunakan Layanan untuk tujuan apa pun yang melanggar hukum atau dilarang oleh Ketentuan ini.`,
    list: [
      "Menggunakan layanan untuk menyebarkan malware, phishing, atau konten ilegal lainnya.",
      "Melakukan aktivitas yang mengganggu atau mengacaukan Layanan.",
      "Mencoba untuk merekayasa balik atau mendekompilasi perangkat lunak.",
      "Menggunakan Layanan untuk membuat tautan yang menyesatkan atau berbahaya.",
    ],
  },
  {
    id: 3,
    icon: Users,
    title: "3. Akun Pengguna",
    content: `Untuk mengakses beberapa fitur Layanan, Anda mungkin perlu membuat akun. Anda bertanggung jawab penuh atas:`,
    list: [
      "Keamanan akun dan kata sandi Anda.",
      "Semua aktivitas yang terjadi di bawah akun tersebut.",
    ],
    note: "Kami tidak akan bertanggung jawab atas kerugian yang timbul akibat kegagalan Anda menjaga keamanan akun.",
  },
  {
    id: 4,
    icon: Shield,
    title: "4. Batasan Tanggung Jawab",
    content: `Dalam batas maksimal yang diizinkan oleh hukum yang berlaku, Shortlinkmu tidak bertanggung jawab atas segala bentuk kerugian, baik langsung maupun tidak langsung, termasuk:`,
    list: [
      "Kehilangan keuntungan, pendapatan, data, atau peluang bisnis.",
      "Gangguan layanan, bug, error, atau kehilangan akses.",
      "Penyalahgunaan shortlink oleh pengguna lain.",
      "Kerugian akibat tindakan pihak ketiga seperti peretasan.",
    ],
    note: `Layanan disediakan "sebagaimana adanya" dan "sebagaimana tersedia", tanpa jaminan apa pun.`,
  },
  {
    id: 5,
    icon: RefreshCw,
    title: "5. Perubahan Persyaratan",
    content: `Kami berhak, atas kebijakan kami sendiri, untuk mengubah atau mengganti Ketentuan ini kapan saja. Kami akan memberi tahu Anda tentang perubahan apa pun dengan memposting Ketentuan baru di halaman ini.`,
  },
  {
    id: 6,
    icon: Mail,
    title: "6. Hubungi Kami",
    content: `Jika Anda memiliki pertanyaan tentang Ketentuan ini, silakan hubungi kami melalui halaman kontak.`,
    hasLink: true,
  },
];

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white font-figtree">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-bluelight text-xs font-bold uppercase tracking-wider mb-6">
              <FileText className="w-4 h-4" />
              Legal
            </div>
          </AnimateOnView>
          <AnimateOnView delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Terms of Service
            </h1>
          </AnimateOnView>
          <AnimateOnView delay={0.2}>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Harap baca persyaratan layanan kami dengan saksama sebelum
              menggunakan Shortlinkmu.
            </p>
          </AnimateOnView>
          <AnimateOnView delay={0.3}>
            <p className="text-sm text-slate-500 mt-4">
              Terakhir diperbarui: 2 November 2025
            </p>
          </AnimateOnView>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <AnimateOnView>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-12">
              <p className="text-slate-700 leading-relaxed">
                Selamat datang di Shortlinkmu! Persyaratan Layanan ("Ketentuan")
                ini mengatur penggunaan Anda atas situs web dan layanan kami.
                Dengan menggunakan layanan kami, Anda menyetujui untuk terikat
                oleh ketentuan-ketentuan di bawah ini.
              </p>
            </div>
          </AnimateOnView>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <AnimateOnView key={section.id} delay={index * 0.05}>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl shrink-0">
                      <section.icon className="w-6 h-6 text-slate-700" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900 mb-4">
                        {section.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed">
                        {section.content}
                      </p>

                      {section.list && (
                        <ul className="mt-4 space-y-2">
                          {section.list.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-slate-600"
                            >
                              <span className="text-bluelight mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.note && (
                        <p className="mt-4 text-sm text-slate-500 italic">
                          {section.note}
                        </p>
                      )}

                      {section.hasLink && (
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 mt-4 text-bluelight font-semibold hover:underline"
                        >
                          Hubungi Kami →
                        </Link>
                      )}
                    </div>
                  </div>
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
