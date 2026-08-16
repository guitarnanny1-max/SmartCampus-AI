'use client';

import React, { useState } from 'react';
import { Sparkles, Bed, ShieldCheck, ArrowLeft, CheckCircle2, Search } from 'lucide-react';
import Link from 'next/link';

export default function HostelModule() {
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const hostelLedger = [
    { hostel: 'Aryabhata Hall (Block A - Men)', occupancy: '480 / 500', wardens: 'Dr. R. Sharma', pass: 'Biometric Gate Active', status: '96% Occupied' },
    { hostel: 'Kalpana Chawla Hall (Block B - Women)', occupancy: '510 / 520', wardens: 'Prof. Anjali Sen', pass: 'Facial Turnstile Active', status: '98% Occupied' },
    { hostel: 'Ramanujan Research Scholars Wing', occupancy: '180 / 200', wardens: 'Dr. V. Kulkarni', pass: 'Smart RFID Active', status: '90% Occupied' },
    { hostel: 'International Faculty Residence', occupancy: '95 / 100', wardens: 'Col. M. Thapar', pass: 'Digital Keycard Active', status: '95% Occupied' },
  ];

  const handleAudit = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3500);
  };

  const filtered = hostelLedger.filter(item => 
    item.hostel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.wardens.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Hostel & Residential Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Hostel & Residential Life</h2>
            <p className="text-xs text-slate-400 mt-1">Manage room allocations, digital gate passes, mess menu feedback, and maintenance ticketing.</p>
          </div>
          <button onClick={handleAudit} className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit">
            <Bed className="w-4 h-4" />
            <span>Run Residential Safety Audit</span>
          </button>
        </div>

        {success && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Residential safety audit passed successfully! All biometric turnsiles and visitor logs verified.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Total Resident Capacity</div>
            <div className="text-3xl font-extrabold text-white">1,320 Beds</div>
            <div className="text-[10px] text-slate-400">96.8% overall occupancy</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Digital Gate Passes</div>
            <div className="text-3xl font-extrabold text-emerald-400">4,250 Issued</div>
            <div className="text-[10px] text-emerald-400">Zero unauthorized exit</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Mess Feedback Rating</div>
            <div className="text-3xl font-extrabold text-cyan-400">4.8 / 5.0</div>
            <div className="text-[10px] text-slate-400">AI menu personalization active</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Maintenance SLA</div>
            <div className="text-3xl font-extrabold text-white">&lt; 2 hours</div>
            <div className="text-[10px] text-slate-400">Automated ticket dispatch</div>
          </div>
        </div>

        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Residential Halls & Biometric Access Ledger</span>
            </h3>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search hall or warden..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="space-y-3 text-xs">
            {filtered.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.hostel}</div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Occupancy: <strong className="text-emerald-400">{item.occupancy}</strong></span>
                    <span>Warden: <strong className="text-slate-300">{item.wardens}</strong></span>
                    <span>Access: <strong className="text-cyan-400">{item.pass}</strong></span>
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
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Hostel & Residential Hub</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
