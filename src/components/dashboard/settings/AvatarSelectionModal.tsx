// src/components/dashboard/settings/AvatarSelectionModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

// Local avatar files (1-4)
const AVATAR_IDS = [1, 2, 3, 4];

// Local avatar URL generator
const getAvatarUrl = (id: number) => `/avatars/avatar-${id}.webp`;

interface AvatarSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSelect: (url: string) => void;
}

export default function AvatarSelectionModal({
  isOpen,
  onClose,
  currentAvatar,
  onSelect,
}: AvatarSelectionModalProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const t = useTranslations("Dashboard");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
              isDark ? "bg-card" : "bg-white",
            )}
          >
            <div
              className={clsx(
                "px-8 py-6 flex justify-between items-center z-10",
                isDark
                  ? "bg-card border-b border-gray-800"
                  : "bg-white border-b border-gray-100",
              )}
            >
              <h2 className="text-[2em] font-bold text-shortblack">
                {t("settingsPage.chooseAvatar")}
              </h2>
              <button
                onClick={onClose}
                className={clsx(
                  "p-2 rounded-full text-grays transition-colors",
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-100",
                )}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div
              onWheel={(e) => e.stopPropagation()}
              className="p-8 overflow-y-auto custom-scrollbar-minimal bg-blues/30"
            >
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
                {AVATAR_IDS.map((id) => {
                  const url = getAvatarUrl(id);
                  const isSelected = currentAvatar === url;

                  return (
                    <button
                      key={id}
                      onClick={() => {
                        onSelect(url);
                        onClose();
                      }}
                      className={clsx(
                        "group relative aspect-square rounded-full transition-all duration-200",
                        isSelected
                          ? "ring-4 ring-bluelight scale-105 shadow-lg"
                          : isDark
                            ? "hover:scale-105 hover:shadow-md bg-card border-2 border-transparent hover:border-blue-500"
                            : "hover:scale-105 hover:shadow-md bg-white border-2 border-transparent hover:border-blue-200",
                      )}
                    >
                      <div
                        className={clsx(
                          "w-full h-full rounded-full overflow-hidden relative",
                          isDark ? "bg-card" : "bg-white",
                        )}
                      >
                        {/* Image Next.js dengan URL yang sudah diperbaiki */}
                        <Image
                          src={url}
                          alt={`Avatar ${id}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100px, 150px" // Optimasi ukuran
                        />
                      </div>
                      {isSelected && (
                        <div
                          className={clsx(
                            "absolute bottom-0 right-0 bg-bluelight text-white p-1.5 rounded-full border-2 shadow-sm",
                            isDark ? "border-card" : "border-white",
                          )}
                        >
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
