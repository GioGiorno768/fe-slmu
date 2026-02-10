// src/app/[locale]/(member)/new-link/page.tsx
"use client";

import { useState } from "react";
import CreateShortlink from "@/components/dashboard/CreateShortlink";
import MassLinkCreator from "@/components/dashboard/MassLinkCreator";
import LinkList from "@/components/dashboard/links/LinkList";
import EditLinkModal from "@/components/dashboard/EditLinkModal";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import { useLinks } from "@/hooks/useLinks";
import type { Shortlink } from "@/types/type";
import clsx from "clsx";
import { Link as LinkIcon, Layers } from "lucide-react";
import { useTranslations } from "next-intl";

type CreateMode = "single" | "mass";

export default function NewLinkPage() {
  const {
    links,
    totalPages,
    generatedLink,
    isLoading,
    isFetching,
    isMutating,
    page,
    setPage,
    filters,
    setFilters,
    createLink,
    updateLink,
    toggleLinkStatus,
  } = useLinks();

  const [createMode, setCreateMode] = useState<CreateMode>("single");
  const t = useTranslations("Dashboard");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Shortlink | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<{
    id: string;
    status: "active" | "disabled";
  } | null>(null);

  const openEditModal = (id: string) => {
    const link = links.find((l) => l.id === id);
    if (link) {
      setEditingLink(link);
      setIsEditOpen(true);
    }
  };

  const openConfirmModal = (id: string, status: "active" | "disabled") => {
    setConfirmData({ id, status });
    setIsConfirmOpen(true);
  };

  const handleConfirmStatus = async () => {
    if (confirmData) {
      await toggleLinkStatus(confirmData.id, confirmData.status);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree space-y-6 pb-10">
      {/* Tab Toggle */}
      <div className="bg-card p-2 rounded-xl shadow-sm shadow-slate-500/50 inline-flex gap-2">
        <button
          onClick={() => setCreateMode("single")}
          className={clsx(
            "flex items-center gap-2 px-6 py-3 rounded-lg text-[1.4em] font-semibold transition-all",
            createMode === "single"
              ? "bg-gradient-to-r from-blue-background-gradient to-purple-background-gradient text-tx-blue-dashboard shadow-lg shadow-lightpurple-dashboard/30"
              : "text-grays hover:bg-subcard hover:text-shortblack",
          )}
        >
          <LinkIcon className="w-5 h-5" />
          {t("newLinkPage.singleLink")}
        </button>
        <button
          onClick={() => setCreateMode("mass")}
          className={clsx(
            "flex items-center gap-2 px-6 py-3 rounded-lg text-[1.4em] font-semibold transition-all",
            createMode === "mass"
              ? "bg-gradient-to-r from-blue-background-gradient to-purple-background-gradient text-tx-blue-dashboard shadow-lg shadow-lightpurple-dashboard/30"
              : "text-grays hover:bg-subcard hover:text-shortblack",
          )}
        >
          <Layers className="w-5 h-5" />
          {t("newLinkPage.massLink")}
        </button>
      </div>

      {/* Conditional Render based on mode */}
      {createMode === "single" ? (
        <CreateShortlink
          generatedLink={generatedLink}
          isLoading={isMutating}
          error={null}
          onSubmit={createLink}
        />
      ) : (
        <MassLinkCreator />
      )}

      <LinkList
        links={links}
        totalPages={totalPages}
        filters={filters}
        setFilters={setFilters}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        isFetching={isFetching}
        onEdit={openEditModal}
        onToggleStatus={openConfirmModal}
      />

      {/* Modal Edit */}
      <EditLinkModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        isUpdating={isMutating}
        initialData={
          editingLink
            ? {
                alias: editingLink.shortUrl.split("/").pop() || "",
                password: editingLink.password,
                expiresAt: editingLink.dateExpired
                  ? new Date(editingLink.dateExpired).toISOString().slice(0, 16)
                  : "",
                // FIX: Kasih default value biar gak undefined
                adsLevel: editingLink.adsLevel || "level1",
              }
            : null
        }
        onSubmit={async (data) => {
          if (editingLink) {
            await updateLink(editingLink.id, data);
            setIsEditOpen(false);
          }
        }}
      />

      {/* Modal Konfirmasi */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmStatus}
        title={
          confirmData?.status === "active"
            ? t("newLinkPage.disableTitle")
            : t("newLinkPage.enableTitle")
        }
        description={
          confirmData?.status === "active"
            ? t("newLinkPage.disableDesc")
            : t("newLinkPage.enableDesc")
        }
        confirmLabel={
          confirmData?.status === "active"
            ? t("newLinkPage.yesDisable")
            : t("newLinkPage.yesEnable")
        }
        type={confirmData?.status === "active" ? "danger" : "success"}
        isLoading={isMutating}
      />
    </div>
  );
}
