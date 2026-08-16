'use client';

import React, { useState } from 'react';
import { Sparkles, Building2, Shield, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [tenant, setTenant] = useState('Delhi Public International');
  const [email, setEmail] = useState('admin@smartcampus.in');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<'admin' | 'crm_manager' | 'sales_exec' | 'teacher' | 'parent'>('crm_manager');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Redirect based on selection
      if (role === 'sales_exec' || role === 'crm_manager' || role === 'admin') {
        router.push('/crm');
      } else {
        router.push('/portal');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between p-6 md:p-12">
      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus SaaS OS</h1>
            <span className="text-[10px] text-slate-400">Enterprise Authentication Gateway</span>
          </div>
        </div>

        <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
          Back to Home →
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white">Sign In to Your Workspace</h2>
          <p className="text-xs text-slate-400">Select your institution tenant and credentials to access your post-login dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Select Institution Tenant</label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <select
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none"
              >
                <option value="Delhi Public International">Delhi Public International</option>
                <option value="Metro Global Academy">Metro Global Academy</option>
                <option value="St. Xavier Collegiate">St. Xavier Collegiate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Work Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Assigned Role (Post-Login View)</label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none"
              >
                <option value="crm_manager">CRM Manager (Sales Pipeline)</option>
                <option value="sales_exec">Sales Executive</option>
                <option value="admin">Tenant Super Administrator</option>
                <option value="teacher">Teacher Portal</option>
                <option value="parent">Parent Portal</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-cyan-950 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{loading ? 'Authenticating & Loading Workspace...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] text-slate-400 text-center">
          Secured by multi-tenant OAuth 2.0 & Role-Based Access Control (RBAC).
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto text-center text-xs text-slate-500">
        <p>© 2026 SmartCampus SaaS Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
