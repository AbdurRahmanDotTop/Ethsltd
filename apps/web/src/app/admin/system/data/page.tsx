"use client";

import { useState, useEffect } from "react";
import { Download, Database, HardDrive, Trash2, RotateCcw, AlertTriangle, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@ethsltd/api-client";
import * as XLSX from "xlsx";

export default function AdminDataManagementPage() {
  const [activeTab, setActiveTab] = useState<"export" | "backup">("export");
  
  // Export State
  const [isExportingUsers, setIsExportingUsers] = useState(false);
  const [isExportingTransactions, setIsExportingTransactions] = useState(false);

  // Backup State
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isFetchingBackups, setIsFetchingBackups] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);

  // Restore State
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreConfirmText, setRestoreConfirmText] = useState("");
  const [selectedBackupFile, setSelectedBackupFile] = useState<File | null>(null);

  useEffect(() => {
    if (activeTab === "backup") {
      fetchBackups();
    }
  }, [activeTab]);

  const fetchBackups = async () => {
    setIsFetchingBackups(true);
    try {
      const res = await apiClient.adminGetBackups();
      if (res.success) {
        setBackups(res.data || []);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to load backups");
    } finally {
      setIsFetchingBackups(false);
    }
  };

  const handleExport = async (type: "users" | "transactions", format: "csv" | "xlsx") => {
    const setLoader = type === "users" ? setIsExportingUsers : setIsExportingTransactions;
    setLoader(true);
    try {
      const res = type === "users" ? await apiClient.adminExportUsers() : await apiClient.adminExportTransactions();
      
      if (!res.success) {
        throw new Error(res.error || "Failed to export data");
      }

      const data = res.data;
      if (!data || data.length === 0) {
        toast.error("No data available to export");
        return;
      }

      // Convert to worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Export");

      // Download
      const fileName = `ethsltd_${type}_export_${new Date().toISOString().split("T")[0]}.${format}`;
      
      if (format === "csv") {
        XLSX.writeFile(wb, fileName, { bookType: "csv" });
      } else {
        XLSX.writeFile(wb, fileName, { bookType: "xlsx" });
      }
      
      toast.success(`${type} exported successfully as ${format.toUpperCase()}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to generate export");
    } finally {
      setLoader(false);
    }
  };

  const handleCreateBackup = async () => {
    if (!window.confirm("Are you sure you want to create a new full system backup? This may take some time.")) return;
    
    setIsBackingUp(true);
    toast.info("Generating system backup... Please wait.");
    
    try {
      const res = await apiClient.adminCreateBackup();
      
      if (res.success && res.data) {
        toast.success(res.message);
        
        // Trigger local download
        const blob = new Blob([res.data], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = (res as any).metadata?.filename || `backup_ethsltd_${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        fetchBackups();
      } else {
        toast.error(res.error || "Failed to create backup");
      }
    } catch (e: any) {
      toast.error(e.message || "An error occurred while creating backup");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    if (restoreConfirmText !== "RESTORE") {
      toast.error("Please type RESTORE to confirm.");
      return;
    }
    if (!selectedBackupFile) {
      toast.error("Please select a backup file first.");
      return;
    }

    if (!window.confirm("WARNING: This will completely overwrite the existing database with the backup data. Are you absolutely sure?")) return;

    setIsRestoring(true);
    toast.info("Restoring database... Please wait and do not close this window.");

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const res = await apiClient.adminRestoreBackup({ backupData: content });
          
          if (res.success) {
            toast.success("Database restored successfully! Please log in again.");
            window.location.href = "/auth/login"; // Force re-login after restore
          } else {
            toast.error(res.error || "Failed to restore database");
            setIsRestoring(false);
          }
        } catch (err: any) {
          toast.error(err.message || "Restore failed");
          setIsRestoring(false);
        }
      };
      reader.readAsText(selectedBackupFile);
    } catch (e: any) {
      toast.error(e.message || "An error occurred during restore");
      setIsRestoring(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Export platform data and manage full system backups.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-border">
        <button 
          onClick={() => setActiveTab("export")}
          className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === 'export' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Data Export
        </button>
        <button 
          onClick={() => setActiveTab("backup")}
          className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === 'backup' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Backup & Restore
        </button>
      </div>

      {activeTab === "export" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Export Users</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-6">
                Generate a comprehensive export of all users, including KYC status, balances, and risk profiles.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => handleExport('users', 'csv')} 
                disabled={isExportingUsers}
                isLoading={isExportingUsers}
                loadingText="Exporting..."
                variant="outline"
                className="flex-1"
              >
                {!isExportingUsers && <Download className="w-4 h-4 mr-2" />}
                CSV
              </Button>
              <Button 
                onClick={() => handleExport('users', 'xlsx')} 
                disabled={isExportingUsers}
                isLoading={isExportingUsers}
                loadingText="Exporting..."
                variant="default"
                className="flex-1"
              >
                {!isExportingUsers && <Download className="w-4 h-4 mr-2" />}
                Excel (.xlsx)
              </Button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Export Transactions</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-6">
                Export all platform ledger entries, deposits, withdrawals, and trading history.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => handleExport('transactions', 'csv')} 
                disabled={isExportingTransactions}
                isLoading={isExportingTransactions}
                loadingText="Exporting..."
                variant="outline"
                className="flex-1"
              >
                {!isExportingTransactions && <Download className="w-4 h-4 mr-2" />}
                CSV
              </Button>
              <Button 
                onClick={() => handleExport('transactions', 'xlsx')} 
                disabled={isExportingTransactions}
                isLoading={isExportingTransactions}
                loadingText="Exporting..."
                variant="default"
                className="flex-1"
              >
                {!isExportingTransactions && <Download className="w-4 h-4 mr-2" />}
                Excel (.xlsx)
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "backup" && (
        <div className="space-y-8">
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-brand-primary" /> System Backups
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create full logical database dumps. Backups are pushed to Cloudflare R2 automatically (max 3 retained) and simultaneously downloaded locally.
                </p>
              </div>
              <Button 
                onClick={handleCreateBackup}
                disabled={isBackingUp}
                isLoading={isBackingUp}
                loadingText="Creating Backup..."
              >
                {!isBackingUp && <Database className="w-4 h-4 mr-2" />}
                Create New Backup
              </Button>
            </div>

            {isFetchingBackups ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : backups.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground border-t border-border mt-4">
                No backup history found.
              </div>
            ) : (
              <div className="overflow-x-auto border border-border rounded-lg mt-4">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Filename</th>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Storage</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backups.map((bkp) => (
                      <tr key={bkp.id} className="border-t border-border hover:bg-muted/20">
                        <td className="px-4 py-3 font-medium">{new Date(bkp.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{bkp.filename}</td>
                        <td className="px-4 py-3">{formatBytes(bkp.sizeBytes)}</td>
                        <td className="px-4 py-3">
                          {bkp.storedInR2 ? (
                            <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-xs font-medium border border-blue-500/20">Cloudflare R2</span>
                          ) : (
                            <span className="bg-gray-500/10 text-gray-400 px-2 py-0.5 rounded text-xs font-medium border border-gray-500/20">Local Only</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${bkp.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                            {bkp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-red-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Restore System</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-3xl">
              Restoring a backup will <strong>completely overwrite and replace all current database records</strong>. 
              This action is extremely dangerous and irreversible. Ensure you have selected the correct valid JSON backup file.
            </p>

            <div className="bg-background border border-border p-5 rounded-lg max-w-xl space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Backup File (.json)</label>
                <input 
                  type="file" 
                  accept=".json"
                  onChange={(e) => setSelectedBackupFile(e.target.files?.[0] || null)}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-primary-foreground hover:file:opacity-90"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type RESTORE to confirm</label>
                <input 
                  type="text" 
                  value={restoreConfirmText}
                  onChange={(e) => setRestoreConfirmText(e.target.value)}
                  placeholder="RESTORE"
                  className="w-full bg-muted/50 border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <Button
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700 font-bold"
                onClick={handleRestore}
                disabled={isRestoring || !selectedBackupFile || restoreConfirmText !== "RESTORE"}
                isLoading={isRestoring}
                loadingText="Restoring Database..."
              >
                {!isRestoring && <RotateCcw className="w-4 h-4 mr-2" />}
                Confirm Restore
              </Button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
