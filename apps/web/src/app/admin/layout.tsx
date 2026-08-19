import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPermissionGuard } from "@/components/admin/AdminPermissionGuard";

export const metadata: Metadata = {
  title: "Admin Console | ETHSLTD",
  description: "Internal Operations and Administration Console",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminPermissionGuard>
      <div className="h-screen overflow-hidden bg-background flex flex-col">
        <AdminHeader />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 min-w-0 overflow-y-auto bg-muted/20 custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </AdminPermissionGuard>
  );
}
