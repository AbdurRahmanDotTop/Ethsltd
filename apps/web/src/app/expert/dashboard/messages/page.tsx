"use client";

import { MessageSquare } from "lucide-react";

export default function ExpertMessagesPage() {
  return (
    <div className="p-6 md:p-10 max-w-4xl h-full flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mb-6">
        <MessageSquare className="w-10 h-10 text-brand-600" />
      </div>
      <h1 className="text-3xl font-display font-bold text-foreground mb-4">Direct Messaging</h1>
      <p className="text-muted-foreground max-w-md">
        We are building a secure, real-time messaging system for you to communicate directly with your clients. This feature will be available in an upcoming update!
      </p>
      
      <div className="mt-8 px-6 py-3 bg-muted rounded-full text-sm font-medium text-foreground border border-border">
        Coming Soon
      </div>
    </div>
  );
}
