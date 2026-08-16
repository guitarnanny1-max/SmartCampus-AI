import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartCampusAI - Intelligent 360° Campus Operating System",
  description: "Unified Cloud Operating System for Modern Institutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#0d091e] text-slate-100 min-h-screen selection:bg-[#e8d0a9] selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
