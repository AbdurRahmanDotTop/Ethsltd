"use client";

import { useState } from "react";
import { 
  Search, Download, Filter, ShieldAlert, CheckCircle, 
  Settings, UserCheck, AlertTriangle, Info, Calendar, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";
import { apiClient } from "@ethsltd/api-client";

export default function AdminAuditPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await apiClient.getAdminAuditLogs();
        if (res.success) setLogs(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Filter Logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (log.actor && log.actor.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (log.target && log.target.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.ip && log.ip.includes(searchTerm));
    
    const matchesType = filterType === "all" || log.type === filterType;

    return matchesSearch && matchesType;
  });

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Create a mock CSV content
      const csvContent = "data:text/csv;charset=utf-8," 
        + "ID,Timestamp,Type,Action,Actor,IP Address,Target,Severity\n"
        + filteredLogs.map(e => `${e.id},${e.timestamp},${e.type},${e.action},${e.actor},${e.ip},${e.target},${e.severity}`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 1000);
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'info': return <span className="flex items-center gap-1 text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20"><Info className="w-3 h-3"/> Info</span>;
      case 'warning': return <span className="flex items-center gap-1 text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20"><AlertTriangle className="w-3 h-3"/> Warning</span>;
      case 'critical': return <span className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20"><ShieldAlert className="w-3 h-3"/> Critical</span>;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'admin_action': return <UserCheck className="w-4 h-4 text-brand-primary" />;
      case 'system_event': return <Settings className="w-4 h-4 text-purple-500" />;
      case 'security_alert': return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case 'user_event': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit & Security Logs</h1>
          <p className="text-muted-foreground mt-1 text-sm">Review administrative actions, system events, and security alerts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 24 Hours
          </Button>
          <Button onClick={handleExport} disabled={isExporting} className="text-sm">
            <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by ID, IP, Actor or Action..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-shadow"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Event Type:</span>
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none"
          >
            <option value="all">All Events</option>
            <option value="admin_action">Admin Actions</option>
            <option value="security_alert">Security Alerts</option>
            <option value="system_event">System Events</option>
            <option value="user_event">User Events</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Event / Action</th>
                <th className="px-6 py-4 font-medium">Actor</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
                <th className="px-6 py-4 font-medium">Target Entity</th>
                <th className="px-6 py-4 font-medium text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono text-xs">
                      {new Date(log.createdAt || log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center shrink-0">
                          {getTypeIcon(log.type)}
                        </div>
                        <span className="font-medium text-foreground">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {log.actor}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {log.ip}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {log.target}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end">
                        {getSeverityBadge(log.severity)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-muted-foreground/50" />
                      <p>No logs found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
