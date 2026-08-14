"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminUser } from "@/lib/admin/types";
import { apiClient } from "@ethsltd/api-client";
import { AdminDataTable, Column } from "@/components/admin/AdminDataTable";
import { Search, Filter } from "lucide-react";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const limit = 20;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Debounce search slightly
    const timer = setTimeout(async () => {
      try {
        const res = await apiClient.getAdminUsers({ page, limit, search, status });
        if (isMounted && res.success) {
          let items = res.data || [];
          if (status !== 'ALL') {
            items = items.filter((u: any) => u.status === status);
          }
          if (search) {
            const lowSearch = search.toLowerCase();
            items = items.filter((u: any) => 
              u.email?.toLowerCase().includes(lowSearch) || 
              u.displayName?.toLowerCase().includes(lowSearch) ||
              u.id.toLowerCase().includes(lowSearch)
            );
          }
          setUsers(items);
          setTotal(items.length);
        }
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [page, status, search]);

  const columns: Column<any>[] = [
    {
      header: "User ID",
      accessor: "id",
      className: "font-mono text-xs text-brand-primary font-medium"
    },
    {
      header: "Name / Email",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.displayName || 'N/A'}</span>
          <span className="text-xs text-muted-foreground">{row.email}</span>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => {
        const colors: Record<string, string> = {
          ACTIVE: "bg-green-500/10 text-green-500 border-green-500/20",
          FROZEN: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          BANNED: "bg-red-500/10 text-red-500 border-red-500/20",
        };
        const color = colors[row.status] || "bg-muted text-foreground border-border";
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      header: "Role",
      accessor: "role"
    },
    {
      header: "Joined",
      accessor: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      header: "Actions",
      accessor: (row) => (
        <select 
          className="text-xs bg-muted border border-border rounded p-1"
          value={row.status}
          onChange={async (e) => {
            await apiClient.updateAdminUserStatus(row.id, e.target.value);
            window.location.reload();
          }}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="FROZEN">FROZEN</option>
          <option value="BANNED">BANNED</option>
        </select>
      )
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground mt-1 text-sm">View and manage all registered users.</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search ID, Name, Email" 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="pl-9 pr-8 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="FROZEN">Frozen</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      <div className="relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <AdminDataTable 
          columns={columns} 
          data={users} 
          page={page}
          totalPages={Math.ceil(total / limit)}
          onPageChange={setPage}
          onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
        />
      </div>
    </div>
  );
}
