// src/app/[locale]/(member)/history/page.tsx
"use client";

import { useEffect } from "react";
import { useAlert } from "@/hooks/useAlert";
import { Loader2, History as HistoryIcon } from "lucide-react";
import ActivityHistoryList from "@/components/dashboard/history/ActivityHistoryList";
import { useHistory } from "@/hooks/useHistory";

export default function HistoryPage() {
  const { showAlert } = useAlert();

  // Panggil semua logic dari Hook
  const {
    logs,
    isLoading,
    error,
    filter,
    setFilter,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
  } = useHistory();

  // Handle Error Alert
  useEffect(() => {
    if (error) {
      showAlert(error, "error");
    }
  }, [error, showAlert]);

  // Initial Loading Screen (Opsional, atau bisa pake loading di dalem List aja)
  if (isLoading && logs.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      {/* Header Page */}
      <div className="mb-8">
        <h1 className="text-[2.5em] font-bold text-shortblack flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-2xl text-bluelight">
            <HistoryIcon className="w-8 h-8" />
          </div>
          Riwayat Aktivitas
        </h1>
        <p className="text-[1.6em] text-grays mt-2 ml-2">
          Pantau semua kejadian penting yang terjadi pada akun Anda.
        </p>
      </div>

      {/* List Component (Controlled) */}
      <ActivityHistoryList
        activities={logs}
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        isLoading={isLoading}
      />
    </div>
  );
}
