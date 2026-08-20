"use client";

import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

export function CustomChatWidget() {
  return (
    <button 
      onClick={() => {
        if (typeof window !== "undefined") {
          const tawk = (window as any).Tawk_API;
          if (tawk && typeof tawk.toggle === 'function') {
            tawk.toggle();
          } else {
            toast.info("Live chat is connecting. Please wait a moment.");
          }
        }
      }}
      className="fixed z-[9999] flex items-center justify-center bg-[#00C087] text-[#121212] shadow-2xl hover:bg-[#00A070] active:scale-95 transition-all cursor-pointer right-0 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-l-xl md:bottom-8 md:right-8 md:top-auto md:translate-y-0 md:rounded-full md:p-4"
      aria-label="Open Live Chat"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Mobile Icon */}
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 md:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6"/>
      </svg>
      {/* Desktop Icon */}
      <MessageCircle className="hidden md:block w-7 h-7" />
    </button>
  );
}
