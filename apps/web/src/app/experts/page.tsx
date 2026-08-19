"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { Loader2, Search, Star, MessageSquare, Briefcase } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function PublicExpertsPage() {
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await apiClient.getExperts();
        if (res.success) {
          setExperts(res.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const filteredExperts = experts.filter(e => 
    (e.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.bio || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.categories || []).some((c: string) => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-muted/30 py-16 md:py-24 border-b border-border">
          <div className="max-w-7xl mx-auto px-6 md:px-8 text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground">
              Learn from the <span className="text-brand-primary">Best</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Book 1-on-1 sessions with verified crypto and trading experts to elevate your strategies.
            </p>
            
            <div className="max-w-xl mx-auto mt-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search experts by name, category, or skills..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full border border-border bg-card shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-brand-primary">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-muted-foreground">Loading experts...</p>
            </div>
          ) : filteredExperts.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-medium text-foreground mb-2">No experts found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredExperts.map(expert => (
                <Link key={expert.id} href={`/experts/${expert.id}`} className="group block h-full">
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-brand-primary/50 h-full flex flex-col">
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-16 h-16 rounded-full bg-muted border-2 border-background shadow-sm overflow-hidden flex items-center justify-center">
                          {expert.avatarUrl ? (
                            <img src={expert.avatarUrl} alt={expert.displayName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl font-bold text-muted-foreground">
                              {(expert.displayName || 'E').charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-full text-xs font-medium">
                          <Star className="w-3.5 h-3.5 fill-yellow-600" />
                          {expert.rating || 'New'}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground group-hover:text-brand-primary transition-colors">
                        {expert.displayName || 'Verified Expert'}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mt-3 mb-4">
                        {(expert.categories || []).slice(0, 3).map((cat: string) => (
                          <span key={cat} className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-[10px] font-medium uppercase tracking-wider">
                            {cat}
                          </span>
                        ))}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                        {expert.bio || 'Experienced professional offering personalized guidance and strategies.'}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border mt-auto flex-wrap gap-y-4">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          {expert.experienceYears || 0}y exp
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4" />
                          {expert.customersHelped || 0} clients
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
