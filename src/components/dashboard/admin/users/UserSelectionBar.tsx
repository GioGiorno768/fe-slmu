"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Send } from "lucide-react";

interface UserSelectionBarProps {
  selectedCount: number;
  onClear: () => void;
  onSendMessage: () => void;
}

export default function UserSelectionBar({
  selectedCount,
  onClear,
  onSendMessage,
}: UserSelectionBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed top-24 md:top-auto md:bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-shortblack text-white p-3 md:px-6 md:py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 md:gap-6 w-[90vw] max-w-md md:w-auto md:min-w-[320px]">
            <div className="flex items-center gap-2 md:gap-4 border-r border-white/20 pr-3 md:pr-6 shrink-0">
              <span className="font-bold text-[1.2em] md:text-[1.4em] whitespace-nowrap">
                {selectedCount} Selected
              </span>
              <button
                onClick={onClear}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                title="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar">
              <button
                onClick={onSendMessage}
                className="flex items-center gap-2 px-3 py-2 md:px-4 bg-white text-shortblack rounded-xl font-bold text-[1em] md:text-[1.2em] hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send Message</span>
                <span className="sm:hidden">Send</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
