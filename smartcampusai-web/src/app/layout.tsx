import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
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
        {children}
      </body>
    </html>
  );
}
