// Auth Form Wrapper - Right side container
"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ReactNode } from "react";

interface AuthFormWrapperProps {
  children: ReactNode;
  allowScroll?: boolean;
}

export default function AuthFormWrapper({
  children,
  allowScroll = false,
}: AuthFormWrapperProps) {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      onWheel={(e) => e.stopPropagation()}
      className={`flex items-center justify-center bg-white px-6 py-8 md:px-12 lg:px-10 xl:px-1 relative ${
        allowScroll ? "overflow-y-auto" : ""
      }`}
    >
      <div className="w-full max-w-md">
        {/* Back button mobile */}
        <Link
          href="/"
          className="flex lg:hidden items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 transition-colors group text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Home
        </Link>

        {children}
      </div>
    </motion.div>
  );
}
