"use client";

import { useState } from "react";
import { MOCK_EXPERTS } from "@/lib/p2p/mock-data";
import { ExpertCard } from "@/components/p2p/ExpertCard";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExpertsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Extract all unique categories
  const allCategories = ["All", ...Array.from(new Set(MOCK_EXPERTS.flatMap(e => e.categories)))];

  const filteredExperts = MOCK_EXPERTS.filter(expert => {
    const matchesSearch = expert.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          expert.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || expert.categories.includes(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-muted/30 pb-24 min-h-screen">
      <div className="bg-background border-b border-border py-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-4">P2P Expert Services</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Book verified experts for 1-on-1 consultations. Learn trading strategies, merchant setup, risk management, and crypto basics safely.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search experts or skills..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-muted-foreground mr-1 shrink-0" />
            {allCategories.map(cat => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(cat)}
                className="whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {filteredExperts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExperts.map(expert => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card border border-border rounded-xl">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No experts found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
