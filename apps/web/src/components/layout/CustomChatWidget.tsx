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
      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
    </button>
  );
}
