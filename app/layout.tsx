import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "SmartCampusAI - Enterprise Campus ERP",
  description: "Global Multi-tenant Campus Management OS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
