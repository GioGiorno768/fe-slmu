"use client";

import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Apakah layanan shortlink ini aman digunakan?",
      answer:
        "Ya, tentu! Platform kami menggunakan standar keamanan industri untuk melindungi link dan data Anda. Semua link dipindai untuk malware dan konten mencurigakan sebelum dipersingkat.",
    },
    {
      question: "Bagaimana cara menghasilkan uang dari shortened links?",
      answer:
        "Setiap kali seseorang mengklik shortlink Anda, Anda mendapatkan penghasilan berdasarkan CPM (cost per 1000 views). Dengan rate CPM tinggi kami, link Anda dapat menghasilkan lebih banyak pendapatan dibandingkan platform lain.",
    },
    {
      question: "Berapa minimum payout yang bisa ditarik?",
      answer:
        "Minimum payout kami sangat rendah, mulai dari $2 saja. Ini berarti Anda dapat menarik penghasilan lebih cepat tanpa waktu tunggu yang lama.",
    },
    {
      question: "Bagaimana cara kerja referral links?",
      answer:
        "Bagikan link referral unik Anda kepada teman dan dapatkan bonus ekstra saat mereka mendaftar dan mulai menggunakan layanan. Anda akan mendapatkan persentase dari penghasilan mereka sebagai bonus permanen.",
    },
    {
      question: "Bisakah saya mengkustomisasi shortlinks?",
      answer:
        "Ya! Anda dapat membuat custom shortlink dengan alias sendiri, password protection, expiry date, dan pilihan level iklan. Ini membuat link Anda lebih mudah diingat dan profesional.",
    },
    {
      question: "Seberapa cepat proses payout?",
      answer:
        "Payout biasanya diproses dalam 1-7 hari kerja setelah permintaan withdrawal Anda. Kami mendukung berbagai metode pembayaran termasuk PayPal, transfer bank, dan cryptocurrency.",
    },
  ];

  return (
    <section id="faq" className="py-24 md:py-32 bg-slate-50/50 font-figtree">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-bluelight text-xs font-bold uppercase tracking-wider mb-6"
          >
            <HelpCircle className="w-4 h-4" />
            FAQ
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4"
          >
            Pertanyaan yang Sering Diajukan
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg max-w-2xl mx-auto"
          >
            Jawaban untuk pertanyaan umum tentang layanan shortlink kami
          </motion.p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-slate-900 font-semibold text-base md:text-lg">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown
                    className={`w-5 h-5 ${
                      openIndex === index ? "text-bluelight" : "text-slate-400"
                    }`}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
