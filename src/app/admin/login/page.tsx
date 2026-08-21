export const revalidate = 0;
export const dynamic = 'force-dynamic';
"app/admin/login/page.tsx"
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@thomasgcloud.com");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (email.trim() && password.trim()) {
        localStorage.setItem("smartcampus_admin_auth", "true");
        router.push("/admin/leads");
      } else {
        setError("Please enter valid administrator credentials.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0d091e] text-slate-100 flex items-center justify-center p-4 selection:bg-[#e8d0a9] selection:text-black font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1f173d] via-[#0d091e] to-[#0d091e] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#16102f] p-8 sm:p-10 shadow-2xl space-y-8">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#e8d0a9]/10 border border-[#e8d0a9]/20 px-3.5 py-1 text-xs font-bold text-[#e8d0a9] uppercase tracking-widest">
            <ShieldCheck className="h-3.5 w-3.5" /> Secure Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">SmartCampus Console</h1>
          <p className="text-xs text-slate-400">Sign in to access the institutional CRM pipeline and AI intelligence suite.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Administrator Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-[#1f173d] pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-[#e8d0a9] transition-colors font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-[#1f173d] pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-[#e8d0a9] transition-colors font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#e8d0a9] px-4 py-3 text-xs font-bold text-black hover:bg-white transition-colors shadow-lg cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" /> Authenticating Session...
              </>
            ) : (
              <>
                Access Admin Console <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-white/5">
          ThomasG Cloud Enterprise Security &bull; 256-bit SSL Encrypted
        </div>
      </div>
    </div>
  );
}
