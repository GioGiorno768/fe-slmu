"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { motion } from "motion/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Dashboard");
  const tNav = useTranslations("Navbar");

  useEffect(() => {
    // Log the error using a logging service or simple console for now
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // smooth easeOutQuint
        className="bg-card shadow-shd-card w-full max-w-md rounded-2xl border border-gray-100 p-8 shadow-sm dark:border-gray-800"
      >
        <div className="mb-6 flex justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="bg-lightred-dashboard text-redshortlink flex h-20 w-20 items-center justify-center rounded-full text-4xl select-none"
          >
            !
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-foreground mb-3 text-2xl font-bold"
        >
          {t("errorSomethingWentWrong")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-grays mb-8 text-sm leading-relaxed"
        >
          Maaf, telah terjadi kesalahan tak terduga. Silakan coba muat ulang
          atau kembali ke halaman utama.
        </motion.p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => reset()}
            className="bg-bluelight hover:opacity-90 w-full rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all shadow-md shadow-bluelight/20"
          >
            Coba Lagi
          </motion.button>

          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-subcard text-foreground hover:bg-lazyload w-full rounded-xl px-6 py-3 text-sm font-semibold transition-all inline-flex items-center justify-center"
          >
            {tNav("home")}
          </motion.a>
        </div>

        {process.env.NODE_ENV === "development" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.5 }}
            className="bg-lazyload mt-8 overflow-hidden rounded-lg p-3 text-left"
          >
            <p className="mb-2 text-xs font-bold text-red-500">
              Debug Info (Dev Only):
            </p>
            <pre className="scrollbar-thin text-foreground max-h-32 overflow-auto whitespace-pre-wrap text-[10px]">
              <span className="font-bold text-red-400">{error.message}</span>
              {"\n"}
              {error.stack}
            </pre>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
