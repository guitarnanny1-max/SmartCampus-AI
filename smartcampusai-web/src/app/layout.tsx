import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { OfflineIndicator } from "@/components/offline/OfflineIndicator";
import { ServiceWorkerRegistration } from "@/components/offline/ServiceWorkerRegistration";

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  title: "SmartCampusAI — Intelligent Operating System for Education",
  description:
    "SmartCampusAI unifies academics, admissions, administration, finance, learning and AI into one intelligent campus platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased">
        <ThemeProvider>
          {children}
          <OfflineIndicator />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
