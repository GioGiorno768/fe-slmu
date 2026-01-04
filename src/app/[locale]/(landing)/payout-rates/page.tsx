// Server Component - SEO friendly
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import PayoutRatesTable from "@/components/landing/PayoutRatesTable";
import {
  Wallet,
  Building2,
  Bitcoin,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";

// Static data - rendered on server for SEO
const payoutRates = [
  { country: "United States", cpm: 22.0, isoCode: "us" },
  { country: "United Kingdom", cpm: 18.5, isoCode: "gb" },
  { country: "Canada", cpm: 17.0, isoCode: "ca" },
  { country: "Australia", cpm: 16.0, isoCode: "au" },
  { country: "Germany", cpm: 12.0, isoCode: "de" },
  { country: "France", cpm: 11.5, isoCode: "fr" },
  { country: "Sweden", cpm: 10.0, isoCode: "se" },
  { country: "Norway", cpm: 9.5, isoCode: "no" },
  { country: "Indonesia", cpm: 8.0, isoCode: "id" },
  { country: "Malaysia", cpm: 7.5, isoCode: "my" },
  { country: "Brazil", cpm: 5.0, isoCode: "br" },
  { country: "India", cpm: 4.5, isoCode: "in" },
  { country: "Negara Lain", cpm: 3.0, isoCode: "all" },
];

const paymentMethods = [
  {
    name: "PayPal",
    icon: Wallet,
    minPayout: "$5.00",
    processingTime: "1-3 hari",
  },
  {
    name: "Bank Transfer",
    icon: Building2,
    minPayout: "$10.00",
    processingTime: "3-7 hari",
  },
  {
    name: "Crypto (USDT)",
    icon: Bitcoin,
    minPayout: "$25.00",
    processingTime: "1-2 hari",
  },
];

export default function PayoutRates() {
  return (
    <main className="min-h-screen bg-white font-figtree">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section - Static, SEO friendly */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-bluelight text-xs font-bold uppercase tracking-wider mb-6">
            <TrendingUp className="w-4 h-4" />
            Payout Rates
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            CPM Rates Terbaik di Industri
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Dapatkan bayaran tertinggi untuk setiap 1000 views dari traffic
            Anda. Rate kami terus dioptimasi untuk memaksimalkan pendapatan
            Anda.
          </p>
        </div>
      </section>

      {/* Rates Table Section - Client component for search interactivity */}
      <section className="py-16">
        <PayoutRatesTable rates={payoutRates} />
      </section>

      {/* Payment Methods - Static, SEO friendly */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
              Metode Pembayaran
            </h2>
            <p className="text-slate-600 text-lg">
              Tarik penghasilan Anda dengan cepat dan mudah
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="bg-white p-8 rounded-2xl border border-slate-200 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <method.icon className="w-8 h-8 text-bluelight" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {method.name}
                </h3>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>
                    Minimum:{" "}
                    <span className="font-semibold text-bluelight">
                      {method.minPayout}
                    </span>
                  </p>
                  <p>Proses: {method.processingTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Static, SEO friendly */}
      <section className="py-20 bg-gradient-to-br from-bluelight via-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Siap Mulai Menghasilkan?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Daftar gratis sekarang dan mulai monetisasi traffic Anda
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
