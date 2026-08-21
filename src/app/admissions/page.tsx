export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { Sparkles, UserPlus, FileCheck, GraduationCap, ArrowLeft, CheckCircle2, Search, Award, Users, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export default function AdmissionsModule() {
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const applicantsList = [
    { candidate: 'Rohan Sharma', appId: 'APP-2026-9812', program: 'B.Tech Computer Science', score: '98.4 Percentile', status: 'Merit Verified' },
    { candidate: 'Sneha Mukherjee', appId: 'APP-2026-8421', program: 'B.Tech AI & Data Science', score: '99.1 Percentile', status: 'Seat Offered' },
    { candidate: 'Kabir Varma', appId: 'APP-2026-7350', program: 'B.Tech Electronics (VLSI)', score: '94.8 Percentile', status: 'Document Review' },
    { candidate: 'Ananya Sen', appId: 'APP-2026-6219', program: 'MBA Financial Engineering', score: '97.5 Percentile', status: 'Seat Offered' },
  ];

  const handlePublishMerit = () => {
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3500);
  };

  const filteredApplicants = applicantsList.filter((item: any) => 
    item.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.appId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Admissions & Enrollment Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Admissions & Enrollment Management</h2>
            <p className="text-xs text-slate-400 mt-1">Manage freshman applications, entrance exam score validations, AI merit list rankings, and digital seat allocations.</p>
          </div>
          <button
            onClick={handlePublishMerit}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <UserPlus className="w-4 h-4" />
            <span>Publish Round 1 Merit List</span>
          </button>
        </div>

        {publishSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Round 1 AI Merit List successfully published and automated seat allotment letters dispatched via email and SMS.</span>
          </div>
        )}

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Total Applications Received</div>
            <div className="text-3xl font-extrabold text-white">45,800+</div>
            <div className="text-[10px] text-slate-400">+34% YoY application growth</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Average Entrance Percentile</div>
            <div className="text-3xl font-extrabold text-emerald-400">92.4%</div>
            <div className="text-[10px] text-emerald-400 font-medium">Rigorous academic screening</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Seats Allotted</div>
            <div className="text-3xl font-extrabold text-cyan-400">1,850 / 2,000</div>
            <div className="text-[10px] text-slate-400">92.5% seat acceptance rate</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Document Verification SLA</div>
            <div className="text-3xl font-extrabold text-white">&lt; 4 hours</div>
            <div className="text-[10px] text-slate-400">AI OCR credential parsing active</div>
          </div>
        </div>

        {/* Admissions Ledger */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-cyan-400" />
              <span>Applicant Pipeline & Merit Ledger</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search candidate, App ID, program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredApplicants.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.candidate} • <span className="text-cyan-400">{item.appId}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Program: <strong className="text-slate-300">{item.program}</strong></span>
                    <span>Entrance Score: <strong className="text-emerald-400 font-mono">{item.score}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    item.status === 'Seat Offered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    item.status === 'Merit Verified' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.status}
                  </span>
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-400 font-medium transition-colors cursor-pointer">
                    View Dossier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Admissions & Enrollment Hub</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
