// src/app/[locale]/(admin)/layout.tsx
import type { Metadata } from "next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardAuthCheck from "@/components/dashboard/DashboardAuthCheck";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthCheck requiredRole="admin">
      <DashboardLayout role="admin">{children}</DashboardLayout>
    </DashboardAuthCheck>
  );
}
