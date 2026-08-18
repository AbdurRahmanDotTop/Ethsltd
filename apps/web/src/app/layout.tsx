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
      const appUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8787";
      const res = await fetch(`${appUrl}/api/v1/auth/me`, {
        headers: {
          Cookie: `ethsltd_session=${sessionToken}`,
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
            {children}
            <Toaster richColors position="top-right" />
            <AuthModal />
            <BackToTop />
          </AuthProvider>
        </ThemeProvider>
        <Script id="tawk-to" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
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
      </body>
    </html>
  );
}
