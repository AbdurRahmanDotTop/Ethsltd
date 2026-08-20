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
      className="fixed z-[9999] flex items-center justify-center bg-[#00C087] text-[#121212] shadow-2xl hover:bg-[#00A070] active:scale-95 transition-all cursor-pointer right-4 md:right-8 bottom-[calc(79px+env(safe-area-inset-bottom))] rounded-full p-3 md:p-4"
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
