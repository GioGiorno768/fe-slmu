// Server Component - SEO friendly
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { AnimateOnView } from "@/components/landing/AnimateWrappers";
import {
  ShieldCheck,
  Database,
  Settings2,
  Cookie,
  Lock,
  Baby,
  RefreshCw,
  Mail,
} from "lucide-react";
import { Link } from "@/i18n/routing";

const sections = [
  {
    id: 1,
    icon: Database,
    title: "1. Informasi yang Kami Kumpulkan",
    content:
      "Kami dapat mengumpulkan beberapa jenis informasi untuk menyediakan dan meningkatkan Layanan kami:",
    list: [
      {
        title: "Informasi Pribadi",
        desc: "Email, nama pengguna, dan informasi pembayaran saat mendaftar.",
      },
      { title: "URL Asli", desc: "URL yang ingin Anda perpendek." },
      {
        title: "Data Penggunaan",
        desc: "Alamat IP, jenis browser, halaman yang dikunjungi, waktu kunjungan, dan data klik.",
      },
    ],
  },
  {
    id: 2,
    icon: Settings2,
    title: "2. Bagaimana Kami Menggunakan Informasi",
    content: "Kami menggunakan informasi yang kami kumpulkan untuk:",
    list: [
      { desc: "Menyediakan, mengoperasikan, dan memelihara Layanan." },
      { desc: "Memproses pendaftaran akun dan pembayaran Anda." },
      {
        desc: "Memantau dan menganalisis penggunaan untuk meningkatkan Layanan.",
      },
      { desc: "Mendeteksi dan mencegah aktivitas penipuan dan spam." },
      { desc: "Berkomunikasi dengan Anda termasuk pembaruan layanan." },
    ],
  },
  {
    id: 3,
    icon: Cookie,
    title: "3. Cookie dan Teknologi Pelacakan",
    content:
      "Kami menggunakan cookie dan teknologi pelacakan serupa untuk melacak aktivitas di Layanan kami. Cookie adalah file dengan sejumlah kecil data yang mungkin menyertakan identifier unik. Anda dapat menginstruksikan browser untuk menolak semua cookie atau menunjukkan kapan cookie sedang dikirim.",
  },
  {
    id: 4,
    icon: Lock,
    title: "4. Keamanan Data",
    content:
      "Keamanan data Anda penting bagi kami. Kami menggunakan langkah-langkah keamanan yang wajar untuk melindungi Informasi Pribadi Anda dari akses tidak sah.",
    note: "Namun, tidak ada metode transmisi melalui Internet yang 100% aman.",
  },
  {
    id: 5,
    icon: Baby,
    title: "5. Privasi Anak-Anak",
    content:
      "Layanan kami tidak ditujukan untuk siapa pun yang berusia di bawah 13 tahun. Kami tidak secara sadar mengumpulkan informasi dari anak di bawah umur 13 tahun.",
  },
  {
    id: 6,
    icon: RefreshCw,
    title: "6. Perubahan Kebijakan Privasi",
    content:
      "Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami akan memberi tahu Anda dengan memposting kebijakan baru di halaman ini. Anda disarankan untuk meninjau secara berkala.",
  },
  {
    id: 7,
    icon: Mail,
    title: "7. Hubungi Kami",
    content:
      "Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami.",
    hasLink: true,
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white font-figtree">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-bluelight text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4" />
              Legal
            </div>
          </AnimateOnView>
          <AnimateOnView delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Privacy Policy
            </h1>
          </AnimateOnView>
          <AnimateOnView delay={0.2}>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Privasi Anda penting bagi kami. Kebijakan ini menjelaskan
              bagaimana kami mengumpulkan dan menggunakan data Anda.
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
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-12">
              <p className="text-slate-700 leading-relaxed">
                Kebijakan Privasi ini menjelaskan bagaimana Shortlinkmu
                mengumpulkan, menggunakan, dan mengungkapkan informasi Anda saat
                menggunakan layanan kami. Dengan menggunakan layanan kami, Anda
                menyetujui pengumpulan dan penggunaan informasi sesuai dengan
                kebijakan ini.
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
                        <ul className="mt-4 space-y-3">
                          {section.list.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-slate-600"
                            >
                              <span className="text-bluelight mt-1 shrink-0">
                                •
                              </span>
                              <span>
                                {"title" in item && item.title && (
                                  <strong className="text-slate-800">
                                    {item.title}:{" "}
                                  </strong>
                                )}
                                {item.desc}
                              </span>
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
