// src/components/dashboard/DashboardSlider.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react"; // Icon lain dihapus karena dikirim via props
import { Link } from "@/i18n/routing";
import clsx from "clsx";
import type { DashboardSlide } from "@/types/type"; // Import tipe yang tadi
import { useUser } from "@/hooks/useUser";

interface DashboardSliderProps {
  slides: DashboardSlide[];
}

// Helper Styles (Tetap di sini karena ini logic UI)
const getTheme = (theme: string) => {
  switch (theme) {
    case "purple":
      return {
        bg: "bg-gradient-to-br from-[#6b21a8] to-[#a855f7]",
        text: "text-white",
        button: "bg-white text-purple-700 hover:bg-purple-50",
      };
    case "orange":
      return {
        bg: "bg-gradient-to-br from-[#c2410c] to-[#fb923c]",
        text: "text-white",
        button: "bg-white text-orange-700 hover:bg-orange-50",
      };
    default: // blue
      return {
        bg: "bg-gradient-to-br from-bluelight to-blue-600",
        text: "text-white",
        button: "bg-white text-bluelight hover:bg-blue-50",
      };
  }
};

// Terima props 'slides'
export default function DashboardSlider({ slides }: DashboardSliderProps) {
  const { user } = useUser(); // 1. Ambil data user
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // 2. Fungsi Helper buat Replace Placeholder
  const formatText = (text: string) => {
    if (!text) return "";
    // Replace {{name}} dengan user.name atau "User"
    return text.replace(/\{\{name\}\}/g, user?.name || "User");
  };

  const nextSlide = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length); // Pake slides.length dari props
  }, [slides.length]);

  const goToSlide = (i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  useEffect(() => {
    // Cek biar gak error kalau slides kosong
    if (slides.length === 0) return;

    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  // Variasi Animasi
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.98,
    }),
  };

  const transitionConfig = {
    x: {
      type: "tween" as const,
      ease: "circOut" as const, // <--- TAMBAHIN 'as const' DI SINI JUGA
      duration: 0.5,
    },
    opacity: { duration: 0.3 },
    scale: { duration: 0.5 },
  };

  // Safety check kalau data belum masuk / kosong
  if (!slides || slides.length === 0) {
    return (
      <div className="h-full min-h-[180px] bg-background p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-bluelight" />
      </div>
    );
  }

  const currentSlide = slides[index];
  const theme = getTheme(currentSlide.theme);
  const Icon = currentSlide.icon;

  return (
    <div className="relative h-full min-h-[250px] rounded-3xl overflow-hidden shadow-lg group bg-background">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentSlide.id} // Pake ID dari data
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transitionConfig}
          style={{ willChange: "transform, opacity" }}
          className={clsx(
            "absolute inset-0 w-full h-full p-8 flex flex-col justify-center rounded-3xl",
            theme.bg,
            theme.text
          )}
        >
          {/* Dekorasi Desktop */}
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full hidden sm:block blur-3xl pointer-events-none" />
          <div className="absolute left-10 bottom-[-40px] w-40 h-40 bg-black/10 rounded-full hidden sm:block blur-2xl pointer-events-none" />

          {/* Dekorasi Mobile */}
          <div className="absolute -right-5 -top-5 w-32 h-32 bg-white/5 rounded-full sm:hidden pointer-events-none" />

          <div className="relative z-10 flex justify-between items-center gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[1.2em] font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                  Info Terbaru
                </span>
              </div>

              <h2 className="text-[2.4em] font-bold leading-tight tracking-tight line-clamp-2">
                {formatText(currentSlide.title)}
              </h2>
              <p className="text-[1.5em] opacity-90 max-w-lg leading-snug line-clamp-3">
                {formatText(currentSlide.desc)}
              </p>

              <div className="pt-2">
                <Link
                  href={currentSlide.link}
                  className={clsx(
                    "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[1.4em] transition-transform active:scale-95 shadow-md",
                    theme.button
                  )}
                >
                  {formatText(currentSlide.cta)}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Ilustrasi (Hidden di Mobile) */}
            <div className="hidden sm:block w-1/3 shrink-0 text-right opacity-20">
              <Icon className="w-32 h-32 ml-auto" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 right-8 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={clsx(
              "w-3 h-3 rounded-full transition-all duration-300",
              i === index ? "bg-white w-8" : "bg-white/40 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
