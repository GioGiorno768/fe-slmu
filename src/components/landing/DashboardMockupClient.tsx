"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

export default function DashboardMockupClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl mx-auto"
    >
      {children}
    </motion.div>
  );
}
