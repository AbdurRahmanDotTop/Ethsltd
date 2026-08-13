"use client";

import { useState, useEffect } from "react";
import { Loader2, Monitor, Smartphone, Globe } from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
import { UserSession } from "@/lib/auth/types";
import { Button } from "@/components/ui/button";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    const response = await apiClient.getSessions();
    setSessions(response.data || []);
    setIsLoading(false);
  };

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    await apiClient.revokeSession(id);
    setSessions(sessions.filter((s) => s.id !== id));
    setRevokingId(null);
  };

  const handleRevokeAll = async () => {
    setRevokingId("all");
    await apiClient.revokeAllOtherSessions();
    setSessions(sessions.filter((s) => s.isCurrentSession)); // Fallback UI behavior, although backend deletes all for now
    setRevokingId(null);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Active Sessions</h1>
        <p className="text-muted-foreground">Manage the devices that are currently logged into your account.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sessions.map((session) => (
              <div key={session.id} className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${session.isCurrentSession ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' : 'bg-muted text-muted-foreground'}`}>
                    {session.device === "Mobile" ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      {session.browser} on {session.os}
                      {session.isCurrentSession && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                          Current session
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{session.isCurrentSession ? "Last active: Now" : `Last active: ${new Date(session.lastActiveAt).toLocaleString()}`}</span>
                    </div>
                  </div>
                </div>

                {!session.isCurrentSession && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRevoke(session.id)}
                    disabled={revokingId === session.id || revokingId === "all"}
                  >
                    {revokingId === session.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Log out
                  </Button>
                )}
              </div>
            ))}

            {sessions.length === 0 && (
              <div className="p-6 text-center text-muted-foreground">
                No active sessions found.
              </div>
            )}
          </div>
        )}
      </div>

      {sessions.filter(s => !s.isCurrentSession).length > 0 && (
        <div className="pt-4 border-t border-border flex justify-end">
          <Button 
            variant="outline" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleRevokeAll}
            disabled={revokingId !== null}
          >
            {revokingId === "all" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Log out all other devices
          </Button>
        </div>
      )}
    </div>
  );
}
