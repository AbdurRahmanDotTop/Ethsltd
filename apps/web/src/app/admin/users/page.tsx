"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MockAdminProvider } from "@/lib/admin/providers/mock-admin-provider";
import { AdminUser } from "@/lib/admin/types";
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
    const timer = setTimeout(() => {
      MockAdminProvider.getUsers({ page, limit, status, search }).then((res) => {
        if (isMounted) {
          setUsers(res.items);
          setTotal(res.total);
          setLoading(false);
        }
      });
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [page, status, search]);

  const columns: Column<AdminUser>[] = [
    {
      header: "User ID",
      accessor: "id",
      className: "font-mono text-xs text-brand-primary font-medium"
    },
    {
      header: "Name / Email",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.name}</span>
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
          SUSPENDED: "bg-red-500/10 text-red-500 border-red-500/20",
          PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
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
      header: "KYC",
      accessor: (row) => {
        const colors: Record<string, string> = {
          VERIFIED: "text-green-500",
          PENDING: "text-yellow-500",
          REJECTED: "text-red-500",
          UNVERIFIED: "text-muted-foreground",
        };
        return <span className={`text-xs font-medium ${colors[row.kycStatus] || ""}`}>{row.kycStatus}</span>;
      }
    },
    {
      header: "Risk",
      accessor: (row) => {
        const colors: Record<string, string> = {
          LOW: "text-green-500",
          MEDIUM: "text-yellow-500",
          HIGH: "text-orange-500",
          CRITICAL: "text-red-500 font-bold",
        };
        return <span className={`text-xs ${colors[row.riskLevel] || ""}`}>{row.riskLevel}</span>;
      }
    },
    {
      header: "Balance",
      accessor: (row) => (
        <span className="font-medium">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.balanceUsd)}
        </span>
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
