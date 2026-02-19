"use client";

import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
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
                ? "bg-bluelanding text-white"
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
  );
}
