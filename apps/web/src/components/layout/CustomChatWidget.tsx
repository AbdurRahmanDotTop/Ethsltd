"use client";

export function CustomChatWidget() {
  return (
    <button 
      onClick={() => {
        if (typeof window !== "undefined" && (window as any).Tawk_API) {
          (window as any).Tawk_API.toggle();
        }
      }}
      className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#00C087] text-[#121212] p-2 rounded-l-lg shadow-lg z-50 flex items-center justify-center hover:bg-[#00A070] transition-colors"
      aria-label="Open Live Chat"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6"/>
      </svg>
    </button>
  );
}
