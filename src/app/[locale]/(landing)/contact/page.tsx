// Server Component - SEO friendly
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { AnimateOnView } from "@/components/landing/AnimateWrappers";
import {
  Mail,
  MessageCircle,
  Headphones,
  Clock,
  Send,
  MapPin,
} from "lucide-react";

const contacts = [
  {
    id: 1,
    name: "Support Umum",
    description: "Untuk pertanyaan umum, kendala teknis, atau masalah akun.",
    email: "support@shortlinkmu.com",
    icon: Headphones,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    name: "Billing & Payout",
    description: "Untuk pertanyaan seputar pembayaran, payout, atau kerjasama.",
    email: "billing@shortlinkmu.com",
    icon: Mail,
    color: "bg-green-50 text-green-600",
  },
];

const infoCards = [
  {
    icon: Clock,
    title: "Jam Operasional",
    desc: "Senin - Jumat, 09:00 - 17:00 WIB",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: MessageCircle,
    title: "Response Time",
    desc: "Maksimal 24 jam untuk email",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: MapPin,
    title: "Lokasi",
    desc: "Jakarta, Indonesia",
    color: "bg-teal-50 text-teal-600",
  },
];

export default function Contact() {
  return (
    <main className="min-h-screen bg-white font-figtree">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-bluelight text-xs font-bold uppercase tracking-wider mb-6">
              <Send className="w-4 h-4" />
              Contact Us
            </div>
          </AnimateOnView>
          <AnimateOnView delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Hubungi Kami
            </h1>
          </AnimateOnView>
          <AnimateOnView delay={0.2}>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Ada pertanyaan atau butuh bantuan? Tim support kami siap membantu
              Anda kapan saja.
            </p>
          </AnimateOnView>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contacts.map((contact, index) => (
              <AnimateOnView key={contact.id} delay={index * 0.1}>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center hover:shadow-xl hover:-translate-y-1 transition-all h-full flex flex-col">
                  <div
                    className={`w-16 h-16 ${
                      contact.color.split(" ")[0]
                    } rounded-2xl mx-auto mb-6 flex items-center justify-center`}
                  >
                    <contact.icon
                      className={`w-8 h-8 ${contact.color.split(" ")[1]}`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {contact.name}
                  </h3>
                  <p className="text-slate-600 mb-6 flex-1">
                    {contact.description}
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="w-full bg-bluelight text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Kirim Email
                  </a>
                </div>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {infoCards.map((info, index) => (
              <AnimateOnView key={info.title} delay={index * 0.1}>
                <div className="text-center p-6">
                  <div
                    className={`w-14 h-14 ${
                      info.color.split(" ")[0]
                    } rounded-xl mx-auto mb-4 flex items-center justify-center`}
                  >
                    <info.icon
                      className={`w-7 h-7 ${info.color.split(" ")[1]}`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {info.title}
                  </h3>
                  <p className="text-slate-600">{info.desc}</p>
                </div>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 md:p-12 rounded-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Cek FAQ Kami
              </h2>
              <p className="text-slate-600 mb-6">
                Mungkin pertanyaan Anda sudah terjawab di halaman FAQ kami
              </p>
              <a
                href="/#faq"
                className="inline-flex items-center gap-2 bg-bluelight text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-all"
              >
                Lihat FAQ
              </a>
            </div>
          </AnimateOnView>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
