import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/providers/query-provider";
import { ConvexClientProvider } from "./convex-client-provider";
import { getToken } from "@/lib/auth-server";
import { Toaster } from "sonner";
import "./globals.css";
import CookieBanner from "@/components/cookie-banner";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zermind.ai"),
  title: "Zermind - AI Chat",
  description: "Open-source AI chat application with multiple LLM providers",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialToken = await getToken();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          data-website-id="689d8d61263a4603b7163a4a"
          data-domain="zermind.ai"
          src="/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConvexClientProvider initialToken={initialToken}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <CookieBanner />
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
