'use client';

import React, { useState } from 'react';
import { Sparkles, Briefcase, Award, ArrowLeft, CheckCircle2, Search } from 'lucide-react';
import Link from 'next/link';

export default function PlacementsModule() {
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const placementLedger = [
    { company: 'Google (DeepMind AI Group)', role: 'AI Research Scientist', ctc: '₹ 68.0 LPA', offers: '12 Students', status: 'Drive Completed' },
    { company: 'Microsoft Research', role: 'Systems Engineer', ctc: '₹ 45.0 LPA', offers: '18 Students', status: 'Drive Completed' },
    { company: 'Goldman Sachs Engineering', role: 'Quantitative Analyst', ctc: '₹ 38.0 LPA', offers: '24 Students', status: 'Ongoing Interviews' },
    { company: 'Tesla Autonomous Systems', role: 'Embedded Vision Lead', ctc: '₹ 52.0 LPA', offers: '8 Students', status: 'Scheduled' },
  ];

  const handleDrive = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3500);
  };

  const filtered = placementLedger.filter(item => 
    item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus AI</h1>
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Placements & Career Hub</span>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </Link>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Placement & Career Services</h2>
            <p className="text-xs text-slate-400 mt-1">Manage AI resume matching, CTC package tracking, recruitment drives, and interview schedules.</p>
          </div>
          <button onClick={handleDrive} className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit">
            <Briefcase className="w-4 h-4" />
            <span>Launch Virtual Recruitment Drive</span>
          </button>
        </div>

        {success && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Virtual recruitment drive broadcasted successfully! 450+ matching student profiles shortlisted.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Overall Placement Rate</div>
            <div className="text-3xl font-extrabold text-emerald-400">98.4%</div>
            <div className="text-[10px] text-emerald-400">Top-tier corporate offers</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Average CTC Package</div>
            <div className="text-3xl font-extrabold text-white">₹ 28.5 LPA</div>
            <div className="text-[10px] text-slate-400">+18% YoY package growth</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Highest CTC Offered</div>
            <div className="text-3xl font-extrabold text-cyan-400">₹ 1.2 Crore</div>
            <div className="text-[10px] text-slate-400">Global tech conglomerate</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Recruiting Partners</div>
            <div className="text-3xl font-extrabold text-white">240+ Firms</div>
            <div className="text-[10px] text-slate-400">Fortune 500 & Unicorns</div>
          </div>
        </div>

        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>Corporate Recruitment Drives & CTC Ledger</span>
            </h3>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search company or role..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="space-y-3 text-xs">
            {filtered.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.company} • <span className="text-cyan-400">{item.role}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>CTC Package: <strong className="text-emerald-400 font-mono">{item.ctc}</strong></span>
                    <span>Offers Extended: <strong className="text-slate-300">{item.offers}</strong></span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold text-[10px] w-fit">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Placements & Career Hub</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
