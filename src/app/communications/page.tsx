'use client';

import React, { useState } from 'react';
import { Sparkles, MessageSquare, Send, ArrowLeft, CheckCircle2, Search } from 'lucide-react';
import Link from 'next/link';

export default function CommunicationsModule() {
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const commsLedger = [
    { title: 'Automated Attendance Alert', recipient: 'Parents of 12th Grade', channel: 'SMS & WhatsApp API', status: 'Delivered (99.8%)' },
    { title: 'Mid-Term Exam Schedule Broadcast', recipient: 'All B.Tech Students', channel: 'Push Notification & Email', status: 'Broadcasted' },
    { title: 'Fee Payment Deadline Reminder', recipient: 'Pending Ledger Accounts', channel: 'Automated Voice Call', status: 'Active Queue' },
    { title: 'Campus Security Emergency SOS', recipient: 'All Resident Students', channel: 'Broadcast Alert', status: 'System Standby' },
  ];

  const handleBroadcast = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3500);
  };

  const filtered = commsLedger.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.recipient.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Communications & Alerts Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Communications & Broadcast Center</h2>
            <p className="text-xs text-slate-400 mt-1">Manage parent alerts, attendance notifications, exam schedules, and emergency campus-wide broadcasts.</p>
          </div>
          <button onClick={handleBroadcast} className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit">
            <Send className="w-4 h-4" />
            <span>Send Instant Broadcast</span>
          </button>
        </div>

        {success && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Broadcast sent successfully across all multi-channel gateways (SMS, WhatsApp, Push)!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Total Messages Sent</div>
            <div className="text-3xl font-extrabold text-white">450,000+</div>
            <div className="text-[10px] text-slate-400">This academic semester</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Delivery Rate</div>
            <div className="text-3xl font-extrabold text-emerald-400">99.9%</div>
            <div className="text-[10px] text-emerald-400">Multi-gateway redundancy</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Parent Engagement</div>
            <div className="text-3xl font-extrabold text-cyan-400">94.2%</div>
            <div className="text-[10px] text-slate-400">Read & acknowledgment rate</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Active Gateways</div>
            <div className="text-3xl font-extrabold text-white">4 Active</div>
            <div className="text-[10px] text-slate-400">SMS, WhatsApp, Email, Push</div>
          </div>
        </div>

        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>Broadcast History & Active Alerts Ledger</span>
            </h3>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search broadcast..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="space-y-3 text-xs">
            {filtered.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.title}</div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Recipient: <strong className="text-slate-300">{item.recipient}</strong></span>
                    <span>Channel: <strong className="text-cyan-400">{item.channel}</strong></span>
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
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Communications & Alerts Hub</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
