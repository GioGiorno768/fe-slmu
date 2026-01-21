// Auth Branding Component - Purple left side with animated background
"use client";

import { motion } from "motion/react";
import { Link as LinkIcon, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

interface AuthBrandingProps {
  title: string;
  subtitle: string;
  accentColor?: "blue" | "purple";
}

export default function AuthBranding({
  title,
  subtitle,
  accentColor = "blue",
}: AuthBrandingProps) {
  const colorConfig = {
    blue: {
      gradient: "from-blue-500 to-purple-600",
      shadow: "shadow-blue-500/50",
      backText: "text-blue-200",
    },
    purple: {
      gradient: "from-purple-500 to-blue-600",
      shadow: "shadow-purple-500/50",
      backText: "text-purple-200",
    },
  };

  const colors = colorConfig[accentColor];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="hidden lg:flex bg-gradient-to-br from-[#10052C] via-[#1a0b3e] to-[#10052C] items-center justify-center relative overflow-hidden"
    >
      {/* Back button */}
      <Link
        href="/"
        className={`absolute top-8 left-8 flex items-center gap-2 ${colors.backText} hover:text-white transition-colors group z-20`}
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">Kembali ke Home</span>
      </Link>

      {/* Animated floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient orbs */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/2 left-1/4 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl"
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Animated ring */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.03] rounded-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`w-20 h-20 mx-auto mb-8 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center shadow-2xl ${colors.shadow}`}
        >
          <LinkIcon className="w-10 h-10 text-white" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-5xl font-bold text-white mb-4"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-xl ${colors.backText}`}
        >
          {subtitle}
        </motion.p>
      </div>
    </motion.div>
  );
}
