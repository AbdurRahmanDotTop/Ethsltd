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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          {children}
          <Toaster richColors position="top-right" />
          <BackToTop />
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
