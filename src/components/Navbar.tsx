'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            SmartCampus AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#explorer" className="hover:text-cyan-400 transition-colors">Platform Modules</a>
          <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Admin Dashboard</Link>
          <Link href="/portal" className="hover:text-cyan-400 transition-colors">Role Portals</Link>
          <Link href="/transport" className="hover:text-cyan-400 transition-colors">GPS Telemetry</Link>
          <Link href="/communications" className="hover:text-cyan-400 transition-colors">WhatsApp API</Link>
          <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
        </nav>

        <a
          href="#contact"
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-900/30"
        >
          Request Demo
        </a>
      </div>
    </header>
  );
}
