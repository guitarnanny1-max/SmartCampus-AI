import Footer from "@/components/Footer";
import UserNavHeader from "@/components/UserNavHeader";
import AIChatWidget from "@/components/AIChatWidget";
export const revalidate = 0;
export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SchoolHeader from "@/components/SchoolHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartCampus AI - Multi-Tenant Platform",
  description: "AI-powered campus operations across multiple institutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-slate-100 min-h-screen`}>
  <UserNavHeader />
        <SchoolHeader />
        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
        <AIChatWidget />
  <Footer />
</body>
    </html>
  );
}
