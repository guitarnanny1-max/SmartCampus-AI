'use client';

import React, { useState } from 'react';
import { Sparkles, FileText, ShieldCheck, Lock, Award, ArrowLeft, CheckCircle2, Search, Cpu, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ExamsModule() {
  const [vaultSuccess, setVaultSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeExams = [
    { code: 'CSE-401', name: 'Advanced Database Architecture', proctor: 'AI Face & Audio Mesh', students: '420 Enrolled', date: 'Aug 20, 2026 • 10:00 AM', status: 'Vault Secured' },
    { code: 'AI-502', name: 'Deep Learning & Neural Networks', proctor: 'GPT-4o Browser Lockdown', students: '310 Enrolled', date: 'Aug 22, 2026 • 02:00 PM', status: 'Vault Secured' },
    { code: 'ECE-303', name: 'VLSI Circuit Design', proctor: 'Biometric ID Verification', students: '280 Enrolled', date: 'Aug 25, 2026 • 11:00 AM', status: 'Preparing' },
    { code: 'FIN-201', name: 'Quantitative Financial Modeling', proctor: 'AI Proctoring Active', students: '190 Enrolled', date: 'Sep 01, 2026 • 09:30 AM', status: 'Vault Secured' },
  ];

  const handleLockVault = () => {
    setVaultSuccess(true);
    setTimeout(() => setVaultSuccess(false), 3500);
  };

  const filteredExams = activeExams.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.proctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus AI</h1>
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Examination & Proctoring Vault</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">AI Examination & Proctoring Vault</h2>
            <p className="text-xs text-slate-400 mt-1">Manage encrypted question paper vaults, AI facial proctoring telemetry, automated anti-cheating alerts, and secure digital transcripts.</p>
          </div>
          <button
            onClick={handleLockVault}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Lock className="w-4 h-4" />
            <span>Encrypt & Lock Question Vault</span>
          </button>
        </div>

        {vaultSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>All upcoming examination question papers successfully encrypted with AES-256 and locked in the ThomasG secure vault.</span>
          </div>
        )}

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Active Exam Sessions</div>
            <div className="text-3xl font-extrabold text-white">18 Modules</div>
            <div className="text-[10px] text-slate-400">Over 3,400 students evaluated</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">AI Proctoring Accuracy</div>
            <div className="text-3xl font-extrabold text-emerald-400">99.94%</div>
            <div className="text-[10px] text-emerald-400 font-medium">Zero false anomaly reports</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Encrypted Vault Status</div>
            <div className="text-3xl font-extrabold text-cyan-400">SECURE</div>
            <div className="text-[10px] text-slate-400">Zero-knowledge cryptographic proof</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Transcript Generation</div>
            <div className="text-3xl font-extrabold text-white">&lt; 1.2 secs</div>
            <div className="text-[10px] text-slate-400">Instant blockchain-backed verification</div>
          </div>
        </div>

        {/* Exams Ledger */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Scheduled Examinations & Proctoring Vault Ledger</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search exam code, name, proctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredExams.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.code} • <span className="text-cyan-400">{item.name}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Proctor Mode: <strong className="text-slate-300">{item.proctor}</strong></span>
                    <span>Enrollment: <strong className="text-slate-300">{item.students}</strong></span>
                    <span>Exam Date: <strong className="text-slate-300 font-mono">{item.date}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold text-[10px]">
                    {item.status}
                  </span>
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-400 font-medium transition-colors cursor-pointer">
                    Manage Vault
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Examination & Proctoring Vault</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
