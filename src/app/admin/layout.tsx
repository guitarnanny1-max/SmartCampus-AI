"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Users, Sparkles, BarChart3, LogOut, Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }

    const auth = localStorage.getItem("smartcampus_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push("/admin/login");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("smartcampus_admin_auth");
    router.push("/admin/login");
  };

  if (isAuthenticated === null && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-[#0d091e] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#e8d0a9]" />
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0d091e] text-slate-100 font-sans selection:bg-[#e8d0a9] selection:text-black">
      {/* Admin Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0d091e]/80 border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e8d0a9] bg-[#e8d0a9]/10 px-3 py-1 rounded-full border border-[#e8d0a9]/20 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin Console
            </span>
            <span className="text-lg font-black tracking-tight text-white">SmartCampus SIS</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-[#16102f] p-1.5 rounded-2xl border border-white/10">
            <Link
              href="/admin/leads"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                pathname === "/admin/leads"
                  ? "bg-[#e8d0a9] text-black shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="h-3.5 w-3.5" /> Leads CRM
            </Link>

            <Link
              href="/admin/ai-intelligence"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                pathname === "/admin/ai-intelligence"
                  ? "bg-[#e8d0a9] text-black shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> AI Intelligence
            </Link>

            <Link
              href="/admin/analytics"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                pathname === "/admin/analytics"
                  ? "bg-[#e8d0a9] text-black shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </Link>
          </nav>

          {/* Admin Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white">Admin Principal</span>
              <span className="text-[10px] text-slate-400 font-mono">admin@thomasgcloud.com</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">{children}</main>
    </div>
  );
}
