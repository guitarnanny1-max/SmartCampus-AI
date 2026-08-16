'use client';

import React, { useState } from 'react';
import { Sparkles, ShieldCheck, UserCheck, ArrowLeft, CheckCircle2, Search, QrCode, Phone, Clock, Download } from 'lucide-react';
import Link from 'next/link';

export default function VisitorsModule() {
  const [visitorSuccess, setVisitorSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const visitorsList = [
    { id: 1, visitorName: 'Vikram Malhotra', purpose: 'Parent-Teacher Meeting (Grade 11)', host: 'Dr. R. K. Sharma', badgeNo: 'VIS-2026-881', checkIn: '10:15 AM', status: 'Checked In' },
    { id: 2, visitorName: 'Sanjay Gupta', purpose: 'IT Infrastructure Maintenance', host: 'IT Operations Desk', badgeNo: 'VIS-2026-882', checkIn: '11:00 AM', status: 'Checked In' },
    { id: 3, visitorName: 'Prof. Arvind Swamy', purpose: 'Guest Lecture in Physics Dept', host: 'Principal Dr. V. Murthy', badgeNo: 'VIS-2026-879', checkIn: '09:30 AM', status: 'Checked Out' },
    { id: 4, visitorName: 'Pooja Hegde', purpose: 'Book Fair Vendor Consultation', host: 'Library Head', badgeNo: 'VIS-2026-883', checkIn: '11:45 AM', status: 'Checked In' },
  ];

  const handleRegisterVisitor = () => {
    setVisitorSuccess(true);
    setTimeout(() => setVisitorSuccess(false), 3500);
  };

  const filteredVisitors = visitorsList.filter(v => 
    v.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.badgeNo.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus SaaS OS</h1>
            <span className="text-[10px] text-slate-400">Visitor Management & Gate Security Hub</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Visitor Management & Campus Security</h2>
            <p className="text-xs text-slate-400 mt-1">Manage digital visitor registration, QR code gate passes, automated host notifications, and campus perimeter logging.</p>
          </div>
          <button
            onClick={handleRegisterVisitor}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <QrCode className="w-4 h-4" />
            <span>Issue Digital Visitor Gate Pass</span>
          </button>
        </div>

        {visitorSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Visitor badge generated successfully and host notification dispatched via SMS & WhatsApp!</span>
          </div>
        )}

        {/* Visitors KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Visitors on Campus Today</div>
            <div className="text-3xl font-extrabold text-white">42 Visitors</div>
            <div className="text-[10px] text-cyan-400 font-medium">All badges active</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Gate Security Status</div>
            <div className="text-3xl font-extrabold text-emerald-400">Secure</div>
            <div className="text-[10px] text-slate-400">All 4 gates synchronized</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Average Check-in Time</div>
            <div className="text-3xl font-extrabold text-cyan-400">45 Seconds</div>
            <div className="text-[10px] text-slate-400">Express QR scanner active</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Perimeter Breach Alerts</div>
            <div className="text-3xl font-extrabold text-emerald-400">0 Incidents</div>
            <div className="text-[10px] text-slate-400">AI surveillance clear</div>
          </div>
        </div>

        {/* Visitors Table */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Campus Visitor & Gate Roster</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search visitor, purpose, host..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredVisitors.map((visitor) => (
              <div key={visitor.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{visitor.visitorName} • <span className="text-cyan-400 font-mono">{visitor.badgeNo}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Purpose: <strong className="text-slate-300">{visitor.purpose}</strong></span>
                    <span>Host: <strong className="text-slate-300">{visitor.host}</strong></span>
                    <span className="text-slate-500 font-mono">Check-in: {visitor.checkIn}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    visitor.status === 'Checked In' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {visitor.status}
                  </span>
                  <button className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-colors cursor-pointer">
                    <Download className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
