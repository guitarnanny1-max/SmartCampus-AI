export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { Sparkles, FileText, Shield, ArrowLeft, CheckCircle2, Search } from 'lucide-react';
import Link from 'next/link';

export default function ExaminationsModule() {
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const examLedger = [
    { exam: 'B.Tech CS - Advanced Algorithms Mid-Term', enrolled: '420 Students', proctoring: 'AI Facial & Eye Tracking', status: 'Completed 100%' },
    { exam: 'MBA - Financial Derivatives Final Exam', enrolled: '180 Students', proctoring: 'Secure Browser Lockdown', status: 'Completed 100%' },
    { exam: 'B.Tech AI - Deep Learning Lab Viva', enrolled: '210 Students', proctoring: 'Code Plagiarism AI Check', status: 'Active Session' },
    { exam: 'Electronics - VLSI Design Theory', enrolled: '150 Students', proctoring: 'Multi-Factor Proctoring', status: 'Scheduled' },
  ];

  const handleProctor = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3500);
  };

  const filtered = examLedger.filter((item: any) => 
    item.exam.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Examinations & Proctoring Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Examinations & AI Proctoring</h2>
            <p className="text-xs text-slate-400 mt-1">Manage secure AI proctoring, automated gradebooks, SGPA/CGPA computation, and hall tickets.</p>
          </div>
          <button onClick={handleProctor} className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit">
            <Shield className="w-4 h-4" />
            <span>Run AI Malpractice Audit</span>
          </button>
        </div>

        {success && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>AI malpractice audit successful! Zero anomalies detected across all active exam sessions.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Exams Supervised</div>
            <div className="text-3xl font-extrabold text-white">420 Sessions</div>
            <div className="text-[10px] text-slate-400">100% secure proctoring uptime</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Malpractice Prevention</div>
            <div className="text-3xl font-extrabold text-emerald-400">Zero Incidents</div>
            <div className="text-[10px] text-emerald-400">Real-time eye & audio tracking</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">SGPA Computation SLA</div>
            <div className="text-3xl font-extrabold text-cyan-400">&lt; 30 minutes</div>
            <div className="text-[10px] text-slate-400">Automated gradebook generation</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Digital Hall Tickets</div>
            <div className="text-3xl font-extrabold text-white">18,500 Issued</div>
            <div className="text-[10px] text-slate-400">Encrypted QR verification</div>
          </div>
        </div>

        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Examination Schedules & AI Proctoring Ledger</span>
            </h3>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search exam name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="space-y-3 text-xs">
            {filtered.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.exam}</div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Enrolled: <strong className="text-slate-300">{item.enrolled}</strong></span>
                    <span>Proctoring: <strong className="text-cyan-400">{item.proctoring}</strong></span>
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
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Examinations & Proctoring Hub</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
