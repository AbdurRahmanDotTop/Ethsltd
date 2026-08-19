export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

import { BackToTop } from "@/components/layout/BackToTop";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || process.env.CF_PAGES_URL;
const metadataBaseUrl = appUrl ? new URL(appUrl.startsWith('http') ? appUrl : `https://${appUrl}`) : undefined;

export const metadata: Metadata = {
  title: "ETHSLTD Crypto - Trade Crypto With Clarity",
  description: "The modern digital asset platform. Trade crypto with clarity and confidence.",
  metadataBase: metadataBaseUrl,
  openGraph: {
    title: "ETHSLTD Crypto",
    description: "The modern digital asset platform. Trade crypto with clarity and confidence.",
    url: "/",
    siteName: "ETHSLTD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ETHSLTD Crypto",
    description: "The modern digital asset platform.",
  },
};

import Script from "next/script";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { AuthModal } from "@/components/auth/AuthModal";
import { AppNavigation } from "@/components/layout/AppNavigation";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { cookies } from "next/headers";
import { AuthUser } from "@/lib/auth/types";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("ethsltd_session")?.value;
  let initialUser: AuthUser | null = null;

  if (sessionToken) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.ethsltd.com";
      const res = await fetch(`${appUrl}/api/v1/auth/me`, {
        headers: {
          Cookie: `ethsltd_session=${sessionToken}`,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ETHSLTD-SSR/1.0",
          "Accept": "application/json"
        },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          initialUser = data.data;
        }
      }
    } catch (e) {
      console.error("Failed to fetch SSR user session:", e);
    }
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col font-sans overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider initialUser={initialUser}>
            <div className="flex-1 pb-16">
              {children}
            </div>
            <AppNavigation />
            <Toaster richColors position="top-right" />
            <AuthModal />
            <BackToTop />
          </AuthProvider>
        </ThemeProvider>
        <Script id="tawk-to" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            Tawk_API.customStyle = {
              visibility: {
                desktop: { xOffset: '1000px', yOffset: '1000px' },
                mobile: { xOffset: '1000px', yOffset: '1000px' }
              }
            };
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/699edde4a29a6d1c30a56a25/1jia95ht8';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
        
        {/* Custom Tawk.to trigger that doesn't block the nav */}
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
      </body>
    </html>
  );
}
