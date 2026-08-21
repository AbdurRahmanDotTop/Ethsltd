"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText, CheckSquare, Square, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AVAILABLE_MODULES = [
  "Users", "User Profiles", "Wallets", "Transactions", "Trades",
  "Trading Orders", "P2P Ads", "P2P Orders", "Escrow Records", "Disputes",
  "Payment Methods", "Ledger Accounts", "Ledger Entries", "System Settings",
  "Audit Logs", "Support Tickets"
];

export default function AdminBackupsPage() {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const toggleModule = (module: string) => {
    setSelectedModules(prev => 
      prev.includes(module) 
        ? prev.filter(m => m !== module)
        : [...prev, module]
    );
  };

  const selectAll = () => setSelectedModules([...AVAILABLE_MODULES]);
  const deselectAll = () => setSelectedModules([]);

  const handleExport = async (format: "xlsx" | "csv", exportAll: boolean = false) => {
    if (!exportAll && selectedModules.length === 0) {
      toast.error("Please select at least one module to export.");
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading(`Generating ${format.toUpperCase()} export... This may take a moment.`);

    try {
      const modulesParam = exportAll ? "All" : selectedModules.join(',');
      const url = `/api/export?modules=${encodeURIComponent(modulesParam)}&format=${format}`;
      
      // We use standard window.location to trigger the browser download directly
      // since the Next.js API route returns the file buffer with Content-Disposition attachment.
      window.location.href = url;
      
      setTimeout(() => {
        toast.dismiss(toastId);
        toast.success("Export started successfully. Check your downloads.");
      }, 2000);
    } catch (e: any) {
      toast.dismiss(toastId);
      toast.error(e.message || "Failed to generate export");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Backups & Exports</h1>
          <p className="text-muted-foreground mt-1 text-sm">Download comprehensive system data in Excel or CSV format.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Module Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold">Select Modules to Export</h3>
                <p className="text-sm text-muted-foreground mt-1">Choose specific data tables to include in your custom export.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
                <Button variant="ghost" size="sm" onClick={deselectAll}>Clear</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_MODULES.map(module => {
                const isSelected = selectedModules.includes(module);
                return (
                  <div 
                    key={module}
                    onClick={() => toggleModule(module)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected ? 'border-brand-primary bg-brand-primary/5' : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-brand-primary shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                    <span className="text-sm font-medium">{module}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex gap-4">
              <Button 
                onClick={() => handleExport('xlsx')} 
                disabled={isExporting || selectedModules.length === 0}
                className="flex-1"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Selected (Excel)
              </Button>
              <Button 
                onClick={() => handleExport('csv')} 
                disabled={isExporting || selectedModules.length === 0}
                variant="outline"
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export Selected (CSV)
              </Button>
            </div>
          </div>
        </div>

        {/* Global Export & Info */}
        <div className="space-y-6">
          <div className="bg-card border-brand-primary/20 bg-brand-primary/5 rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Complete System Backup</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Download every single record from the database across all modules. Passwords and sensitive authentication secrets are automatically stripped.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => handleExport('xlsx', true)} 
                disabled={isExporting}
                className="w-full justify-center"
              >
                {isExporting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <FileSpreadsheet className="w-4 h-4 mr-2" />}
                Full Backup (Excel)
              </Button>
              <Button 
                onClick={() => handleExport('csv', true)} 
                disabled={isExporting}
                variant="outline"
                className="w-full justify-center bg-background"
              >
                {isExporting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                Full Backup (CSV)
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
