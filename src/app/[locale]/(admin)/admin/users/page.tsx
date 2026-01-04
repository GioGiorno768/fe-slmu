"use client";

import UserTable from "@/components/dashboard/admin/users/UserTable";
import UserStatsRow from "@/components/dashboard/admin/users/UserStatsRow";
import UserSelectionBar from "@/components/dashboard/admin/users/UserSelectionBar";
import SendMessageModal from "@/components/dashboard/admin/users/SendMessageModal";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useState } from "react";

export default function ManageUsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Panggil Hook Sakti kita 🪄
  // Ambil semua data & fungsi kontrol dari sini
  const {
    users,
    stats,
    isLoading,
    page,
    setPage,
    totalPages,
    totalCount, // <--- Ambil totalCount
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    toggleStatus,
    // Selection
    selectedIds,
    isAllSelected, // <--- New State
    toggleSelection,
    selectAll,
    clearSelection,
    sendMessage,
    isSending,
  } = useAdminUsers();

  const selectedCount = isAllSelected ? totalCount : selectedIds.size;

  return (
    <div className="space-y-8 pb-10 text-[10px]">
      {/* 1. Quick Stats Row (Head-up Display) */}
      {/* Nampilin Total User, Active, Banned, Balance */}
      <UserStatsRow stats={stats} isLoading={isLoading} />

      {/* 2. Main User Table (Core Data) */}
      {/* Tabel lengkap dengan fitur search, filter, dan action */}
      <UserTable
        users={users}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onToggleStatus={toggleStatus}
        // Selection Props
        selectedIds={selectedIds}
        isAllSelected={isAllSelected} // <--- Pass Prop
        onToggleSelection={toggleSelection}
        onSelectAll={selectAll} // Masih dipake buat logic internal kalo perlu, tapi UI nya udah pindah
      />

      {/* 3. Bulk Action Bar */}
      <UserSelectionBar
        selectedCount={selectedIds.size}
        onClear={clearSelection}
        onSendMessage={() => setIsModalOpen(true)}
      />

      {/* 4. Send Message Modal */}
      <SendMessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={async (subject, message, type) => {
          await sendMessage(subject, message, type);
          setIsModalOpen(false);
        }}
        recipientCount={selectedCount} // <--- Use calculated count
        isSending={isSending}
      />
    </div>
  );
}
