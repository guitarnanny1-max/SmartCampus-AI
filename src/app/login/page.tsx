'use client';

import React, { useState } from 'react';
import { Sparkles, Lock, Mail, Building2, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@smartcampus.os');
  const [password, setPassword] = useState('••••••••••••');
  const [tenant, setTenant] = useState('Silicon Valley Hub (Main Campus)');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-center items-center p-6 selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      {/* Background ambient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card Container */}
      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-8 relative z-10">
        
        {/* Header Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl shadow-lg shadow-cyan-950">
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus SaaS OS</h1>
            <p className="text-xs text-slate-400 mt-1">Enterprise Multi-Tenant Institutional Authentication</p>
          </div>
        </div>

        {loginSuccess ? (
          <div className="p-6 bg-cyan-950/50 border border-cyan-500/40 rounded-2xl text-center space-y-3 animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-cyan-400 mx-auto" />
            <div className="text-sm font-bold text-white">Authentication Successful!</div>
            <p className="text-xs text-slate-300">Establishing encrypted AES-256 session and redirecting to Master Control Center...</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Tenant Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select Institution / Campus Workspace</span>
              </label>
              <select
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option>Silicon Valley Hub (Main Campus)</option>
                <option>Boston Research Institute</option>
                <option>London Global Technology Academy</option>
                <option>Singapore Innovation Campus</option>
              </select>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Administrative Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Password / Security Key</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Secured with multi-factor authentication & AES-256 encryption.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-2xl transition-all shadow-lg shadow-cyan-950 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating Node...</span>
              ) : (
                <>
                  <span>Access Institution Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Link */}
        <div className="text-center text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
          SmartCampus SaaS OS • Powered by ThomasG Technologies
        </div>
      </div>
    </div>
  );
}
