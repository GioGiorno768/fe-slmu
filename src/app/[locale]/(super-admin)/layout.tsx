// src/app/[locale]/(super-admin)/layout.tsx
import type { Metadata } from "next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardAuthCheck from "@/components/dashboard/DashboardAuthCheck";

export const metadata: Metadata = {
  title: "Super Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthCheck requiredRole="super-admin">
      <DashboardLayout role="super-admin">{children}</DashboardLayout>
    </DashboardAuthCheck>
  );
}
