'use client';

import React, { useState } from 'react';
import { Sparkles, Users, Globe, Award, HeartHandshake, ArrowLeft, CheckCircle2, Search, Briefcase, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function AlumniModule() {
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const alumniLedger = [
    { chapter: 'Silicon Valley Chapter (SF / San Jose)', lead: 'Vikram Mehta (Google VP)', members: '4,200 Alumni', endowment: '$ 12.5M Donated', status: 'Active Hub' },
    { chapter: 'Bengaluru Tech & Startup Hub', lead: 'Priya Sundaram (Unicorn Founder)', members: '6,800 Alumni', endowment: '₹ 45.0 Cr Donated', status: 'Active Hub' },
    { chapter: 'London & European Finance Chapter', lead: 'Aarav Nair (Goldman MD)', members: '2,400 Alumni', endowment: '£ 4.2M Donated', status: 'Active Hub' },
    { chapter: 'Tokyo & East Asia Research Chapter', lead: 'Dr. Kenji Sato (Sony Labs)', members: '1,500 Alumni', endowment: '¥ 380M Donated', status: 'Active Hub' },
  ];

  const handleConnectGlobal = () => {
    setConnectSuccess(true);
    setTimeout(() => setConnectSuccess(false), 3500);
  };

  const filteredAlumni = alumniLedger.filter(item => 
    item.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Alumni Relations & Global Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Alumni Relations & Global Networking</h2>
            <p className="text-xs text-slate-400 mt-1">Manage worldwide alumni chapters, endowment fund contributions, student mentorship matching, and global career referrals.</p>
          </div>
          <button
            onClick={handleConnectGlobal}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Globe className="w-4 h-4" />
            <span>Broadcast Global Alumni Mentorship Drive</span>
          </button>
        </div>

        {connectSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Global alumni mentorship drive broadcasted successfully! 3,400+ mentorship connections established for graduating seniors.</span>
          </div>
        )}

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Registered Global Alumni</div>
            <div className="text-3xl font-extrabold text-white">45,000+</div>
            <div className="text-[10px] text-slate-400">Spread across 65 countries</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Total Endowment Fund</div>
            <div className="text-3xl font-extrabold text-emerald-400">₹ 185 Cr</div>
            <div className="text-[10px] text-emerald-400 font-medium">Research grants & student fellowships</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Active Mentorship Pairs</div>
            <div className="text-3xl font-extrabold text-cyan-400">2,850 Pairs</div>
            <div className="text-[10px] text-slate-400">Industry leader 1-on-1 guidance</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Global Chapters</div>
            <div className="text-3xl font-extrabold text-white">28 Cities</div>
            <div className="text-[10px] text-slate-400">Active regional councils</div>
          </div>
        </div>

        {/* Alumni Ledger */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Global Alumni Chapters & Endowment Ledger</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search chapter, lead, status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredAlumni.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.chapter} • <span className="text-cyan-400">Lead: {item.lead}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Members: <strong className="text-slate-300 font-mono">{item.members}</strong></span>
                    <span>Endowment Contribution: <strong className="text-emerald-400 font-mono">{item.endowment}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold text-[10px]">
                    {item.status}
                  </span>
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-400 font-medium transition-colors cursor-pointer">
                    View Chapter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Alumni Relations & Global Networking</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
