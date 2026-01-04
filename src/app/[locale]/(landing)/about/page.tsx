// Server Component - SEO friendly
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Link } from "@/i18n/routing";
import {
  Target,
  Eye,
  Users,
  Link2,
  Shield,
  TrendingUp,
  ArrowRight,
  Heart,
} from "lucide-react";
import {
  AnimateOnView,
  AnimateSlideIn,
  AnimateScale,
  PulseAnimation,
} from "@/components/landing/AnimateWrappers";

// Static data
const team = [
  {
    id: 1,
    name: "Kevin Ragil K.D",
    role: "Co-Founder & CEO",
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    name: "Musthofa Ilmi",
    role: "Co-Founder & CTO",
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: 3,
    name: "Septian Dwi P",
    role: "Co-Founder & CMO",
    color: "bg-teal-50 text-teal-600",
  },
];

const values = [
  {
    icon: Shield,
    title: "Keamanan",
    desc: "Kami memprioritaskan keamanan setiap link dan data pengguna.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: TrendingUp,
    title: "Inovasi",
    desc: "Terus mengembangkan fitur terbaik untuk memaksimalkan pendapatan.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Heart,
    title: "Kepedulian",
    desc: "Memberikan support terbaik untuk setiap pengguna kami.",
    color: "bg-pink-50 text-pink-600",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-figtree">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnView>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-bluelight text-xs font-bold uppercase tracking-wider mb-6">
              <Users className="w-4 h-4" />
              About Us
            </div>
          </AnimateOnView>
          <AnimateOnView delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Tentang ShortLinkmu
            </h1>
          </AnimateOnView>
          <AnimateOnView delay={0.2}>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Pelajari lebih lanjut tentang siapa kami, apa yang kami lakukan,
              dan mengapa kami bersemangat membantu publisher menghasilkan
              lebih.
            </p>
          </AnimateOnView>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <AnimateSlideIn direction="left">
              <div className="space-y-6">
                <h2 className="text-3xl font-extrabold text-slate-900">
                  Cerita Kami
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  ShortLinkmu dimulai dari ide sederhana: membuat proses berbagi
                  link menjadi lebih mudah, aman, dan menguntungkan. Kami
                  melihat banyak kreator, marketer, dan pengguna sehari-hari
                  berjuang dengan URL yang panjang dan tidak menarik.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Kami membangun platform ini untuk mengubah URL tersebut
                  menjadi alat yang ampuh untuk branding, analitik, dan
                  monetisasi. Misi kami adalah memberdayakan setiap orang untuk
                  mendapatkan hasil maksimal dari setiap link yang mereka
                  bagikan.
                </p>
              </div>
            </AnimateSlideIn>

            {/* Right: Visual */}
            <AnimateScale delay={0.2}>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 flex items-center justify-center">
                <PulseAnimation>
                  <div className="w-32 h-32 bg-bluelight rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-200">
                    <Link2 className="w-16 h-16" />
                  </div>
                </PulseAnimation>
              </div>
            </AnimateScale>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <AnimateOnView>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center h-full">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Target className="w-8 h-8 text-bluelight" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Misi Kami
                </h3>
                <p className="text-slate-600">
                  Menyediakan layanan shortlink yang paling aman, andal, dan
                  menguntungkan bagi kreator di seluruh dunia.
                </p>
              </div>
            </AnimateOnView>

            {/* Vision */}
            <AnimateOnView delay={0.1}>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center h-full">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Visi Kami
                </h3>
                <p className="text-slate-600">
                  Menjadi platform pilihan utama untuk manajemen link, di mana
                  setiap link memiliki nilai lebih dari sekadar klik.
                </p>
              </div>
            </AnimateOnView>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
              Nilai-Nilai Kami
            </h2>
            <p className="text-slate-600 text-lg">
              Prinsip yang kami pegang dalam melayani pengguna
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <AnimateOnView key={value.title} delay={index * 0.1}>
                <div className="text-center p-6">
                  <div
                    className={`w-16 h-16 ${
                      value.color.split(" ")[0]
                    } rounded-2xl mx-auto mb-6 flex items-center justify-center`}
                  >
                    <value.icon
                      className={`w-8 h-8 ${value.color.split(" ")[1]}`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-600">{value.desc}</p>
                </div>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimateOnView>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-bluelight text-xs font-bold uppercase tracking-wider mb-4">
                Our Team
              </div>
            </AnimateOnView>
            <AnimateOnView delay={0.1}>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                Tim Kami
              </h2>
            </AnimateOnView>
            <AnimateOnView delay={0.2}>
              <p className="text-slate-600 text-lg">
                Orang-orang hebat di balik layar yang membuat semua ini terjadi
              </p>
            </AnimateOnView>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <AnimateOnView key={member.id} delay={index * 0.1}>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div
                    className={`w-20 h-20 ${
                      member.color.split(" ")[0]
                    } rounded-full mx-auto mb-6 flex items-center justify-center`}
                  >
                    <Users
                      className={`w-10 h-10 ${member.color.split(" ")[1]}`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-bluelight font-medium">{member.role}</p>
                </div>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-bluelight via-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Bergabung Bersama Kami
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Jadilah bagian dari komunitas publisher yang terus berkembang
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-bluelight font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-all shadow-lg"
          >
            Daftar Sekarang
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
