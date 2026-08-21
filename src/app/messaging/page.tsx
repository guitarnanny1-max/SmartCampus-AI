export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { Sparkles, MessageSquare, Send, ArrowLeft, CheckCircle2, Search, Smartphone, Bell, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export default function MessagingModule() {
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const broadcastLogs = [
    { id: 'MSG-901', title: 'Semester Exam Schedule Release', channel: 'WhatsApp & App Push', audience: 'All Students & Parents (1,380)', sentBy: 'Dr. Robert Thorne', time: '10:30 AM Today', status: 'Delivered (99.4%)' },
    { id: 'MSG-902', title: 'Fee Payment Reminder - Q3', channel: 'SMS Gateway', audience: 'Pending Fee Accounts (142)', sentBy: 'Finance Department', time: '09:00 AM Today', status: 'Delivered (100%)' },
    { id: 'MSG-903', title: 'Bus Route #101 Delay Notice', channel: 'Push Notification', audience: 'Route A Parents (45)', sentBy: 'Transport Control', time: 'Yesterday, 04:15 PM', status: 'Delivered (100%)' },
    { id: 'MSG-904', title: 'Campus Security Alert: Weather Advisory', channel: 'Multi-Channel Emergency', audience: 'Entire Campus (14,500+)', sentBy: 'Chief Security Officer', time: 'Aug 14, 2026', status: 'Delivered (99.8%)' },
  ];

  const handleSendBroadcast = () => {
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3500);
  };

  const filteredLogs = broadcastLogs.filter((item: any) => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.audience.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-[10px] text-slate-400">Messaging & Broadcast Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Institutional Messaging & Broadcasts</h2>
            <p className="text-xs text-slate-400 mt-1">Manage WhatsApp Business API, bulk SMS gateways, and instant push alerts for parents, students, and faculty.</p>
          </div>
          <button
            onClick={handleSendBroadcast}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Send className="w-4 h-4" />
            <span>Compose New Broadcast</span>
          </button>
        </div>

        {broadcastSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Broadcast dispatched successfully across WhatsApp Business API, Twilio SMS, and mobile push channels.</span>
          </div>
        )}

        {/* Messaging KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Messages Sent Today</div>
            <div className="text-3xl font-extrabold text-white">12,450</div>
            <div className="text-[10px] text-emerald-400 font-medium">99.8% delivery rate</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">WhatsApp API Status</div>
            <div className="text-3xl font-extrabold text-emerald-400">Active</div>
            <div className="text-[10px] text-slate-400">Official Meta Cloud Node</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Active Parent App Reach</div>
            <div className="text-3xl font-extrabold text-cyan-400">94.2%</div>
            <div className="text-[10px] text-slate-400">iOS & Android push enabled</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">SMS Gateway Balance</div>
            <div className="text-3xl font-extrabold text-cyan-400">4,80,200</div>
            <div className="text-[10px] text-slate-400">Twilio Enterprise Credits</div>
          </div>
        </div>

        {/* Broadcast Ledger Table */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>Broadcast Transmission Ledger</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search broadcast title, channel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredLogs.map((log: any) => (
              <div key={log.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{log.title} • <span className="text-cyan-400 font-mono">{log.id}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Channel: <strong className="text-slate-300">{log.channel}</strong></span>
                    <span>Audience: <strong className="text-slate-300">{log.audience}</strong></span>
                    <span>Sent By: <strong className="text-slate-300">{log.sentBy}</strong></span>
                    <span>Time: <strong className="text-slate-300">{log.time}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold text-[10px]">
                    {log.status}
                  </span>
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-400 font-medium transition-colors cursor-pointer">
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus SaaS OS • Enterprise Messaging & Broadcast Hub</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Powered by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
