// src/components/dashboard/links/LinkList.tsx
"use client";

import { Loader2 } from "lucide-react";
import LinkItem from "./LinkItem";
import LinkFilters from "./LinkFilters";
import Pagination from "../Pagination";
import type { Shortlink, MemberLinkFilters } from "@/types/type";
import Spinner from "../Spinner";
import { useTranslations } from "next-intl";

interface LinkListProps {
  links: Shortlink[];
  totalPages: number;
  // Filter Props (Controlled from Parent)
  filters: MemberLinkFilters;
  setFilters: (v: MemberLinkFilters) => void;
  page: number;
  setPage: (v: number) => void;
  // Loading states
  isLoading: boolean;
  isFetching?: boolean;
  // Actions
  onEdit: (id: string) => void;
  onToggleStatus: (id: string, status: "active" | "disabled") => void;
}

export default function LinkList({
  links,
  totalPages,
  filters,
  setFilters,
  page,
  setPage,
  isLoading,
  isFetching = false,
  onEdit,
  onToggleStatus,
}: LinkListProps) {
  const t = useTranslations("Dashboard");
  // Show spinner for initial load OR during refetch
  const showLoading = isLoading || isFetching;

  return (
    <div className="rounded-xl mt-6 text-[10px]">
      <LinkFilters filters={filters} setFilters={setFilters} />

      <div className="space-y-3 sm:space-y-4 min-h-[200px]">
        {showLoading ? (
          <Spinner />
        ) : links.length === 0 ? (
          <p className="text-center text-grays py-8">
            {t("linkList.noLinksFound")}
          </p>
        ) : (
          links.map((link) => (
            <LinkItem
              key={link.id}
              link={link}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </div>

      {!showLoading && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
