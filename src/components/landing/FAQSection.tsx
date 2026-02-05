"use client";

import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How do I start earning with Shortlinkmu?",
    answer:
      "Simply create a free account, paste your long URLs, and share the shortened links. You earn money every time someone clicks your link based on our competitive CPM rates.",
  },
  {
    question: "What is CPM and how does it work?",
    answer:
      "CPM (Cost Per Mille) is the amount you earn per 1,000 views. Our rates range from $1-$12 depending on traffic quality and visitor location. Tier 1 countries like US, UK, and Canada earn the highest rates.",
  },
  {
    question: "What is the minimum payout amount?",
    answer:
      "Our minimum payout is just $2, making it easy to withdraw your earnings quickly. We support PayPal, Bank Transfer, Dana, OVO, and cryptocurrency withdrawals.",
  },
  {
    question: "Can I customize my short links?",
    answer:
      "Yes! You can create custom aliases, add password protection, set expiry dates, and choose ad levels. Premium members get access to even more customization options.",
  },
  {
    question: "How does the referral program work?",
    answer:
      "Share your unique referral link and earn 10-25% lifetime commission from your referrals' earnings. The more active referrals you have, the higher your commission rate.",
  },
  {
    question: "How fast are payouts processed?",
    answer:
      "Payouts are typically processed within 1-7 business days. We support multiple payment methods including PayPal, bank transfers, e-wallets, and cryptocurrency.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28 bg-white font-poppins">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-tight mb-3 text-slate-800"
          >
            Frequently Asked <span className="text-bluelight">Questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-base md:text-lg font-light"
          >
            Everything you need to know about our platform
          </motion.p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`w-full px-5 py-4 flex items-start justify-between text-left gap-4 rounded-xl transition-all ${
                  openIndex === index
                    ? "bg-bluelight text-white"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-800"
                }`}
              >
                <span className="font-medium text-[15px] leading-relaxed">
                  {faq.question}
                </span>
                <div className="shrink-0 mt-0.5">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-4 text-slate-500 text-sm leading-relaxed">
                      {faq.answer}
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
