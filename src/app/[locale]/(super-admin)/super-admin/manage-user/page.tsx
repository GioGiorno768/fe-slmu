"use client";

import UserTable from "@/components/dashboard/admin/users/UserTable";
import UserStatsRow from "@/components/dashboard/admin/users/UserStatsRow";
import UserSelectionBar from "@/components/dashboard/admin/users/UserSelectionBar";
import SendMessageModal from "@/components/dashboard/admin/users/SendMessageModal";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useState } from "react";
import type { UserStatus } from "@/types/type";

export default function SuperAdminManageUserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [selectedUserForSuspend, setSelectedUserForSuspend] = useState<{
    id: string;
    status: UserStatus;
  } | null>(null);

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

  // Suspend/Unsuspend Handler - Show modal for suspend, direct for unsuspend
  const handleSuspend = async (userId: string, currentStatus: UserStatus) => {
    if (currentStatus === "suspended") {
      // Direct unsuspend (no modal needed)
      await toggleStatus(userId, currentStatus);
    } else {
      // Show modal for suspend (need reason)
      setSelectedUserForSuspend({ id: userId, status: currentStatus });
      setIsSuspendModalOpen(true);
    }
  };

  // Confirm Suspend with Reason
  const handleConfirmSuspend = async (reason?: string) => {
    if (!selectedUserForSuspend || !reason) return;

    try {
      // Toggle status to suspended WITH reason
      await toggleStatus(
        selectedUserForSuspend.id,
        selectedUserForSuspend.status,
        reason // Pass reason to hook -> service -> backend
      );

      setIsSuspendModalOpen(false);
      setSelectedUserForSuspend(null);
    } catch (error) {
      console.error("Failed to suspend user:", error);
    }
  };

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
        detailBasePath="/super-admin/manage-user" // <--- Use Link navigation
        onSuspend={handleSuspend} // <--- Pass suspend handler
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

      {/* 5. Suspend Confirmation Modal */}
      <ConfirmationModal
        isOpen={isSuspendModalOpen}
        onClose={() => {
          setIsSuspendModalOpen(false);
          setSelectedUserForSuspend(null);
        }}
        onConfirm={handleConfirmSuspend}
        title="Suspend User Account"
        description="Please provide a reason for suspending this user. The reason will be sent to the user as a notification."
        confirmLabel="Suspend User"
        cancelLabel="Cancel"
        type="warning"
        showReasonInput={true}
        reasonPlaceholder="Enter suspension reason (e.g., violation of terms, inappropriate content, etc.)"
      />
    </div>
  );
}
