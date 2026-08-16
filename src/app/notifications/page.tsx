'use client';

import React, { useState } from 'react';
import { Sparkles, Bell, Send, MessageSquare, Mail, Smartphone, CheckCircle2, ArrowLeft, Building2, Users, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function NotificationCenterModule() {
  const [channel, setChannel] = useState('WhatsApp');
  const [audience, setAudience] = useState('All Parents');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3500);
    setMessage('');
  };

  const recentBroadcasts = [
    { id: 1, title: 'Q2 Tuition Fee Installment Reminder', channel: 'WhatsApp', audience: 'Fee Defaulters (142)', status: 'Delivered (99.2%)', time: '1 hour ago' },
    { id: 2, title: 'Monsoon Weather Emergency School Closure', channel: 'SMS & Push', audience: 'All Students & Parents (1,480)', status: 'Delivered (100%)', time: 'Yesterday' },
    { id: 3, title: 'Parent-Teacher Conference Schedule Update', channel: 'Email', audience: 'Grade 10 & 12', status: 'Delivered (98.5%)', time: '3 days ago' },
  ];

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
            <span className="text-[10px] text-slate-400">Multi-Channel Notification & Broadcast Center</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Notification & Broadcast Center</h2>
            <p className="text-xs text-slate-400 mt-1">Dispatch verified institutional alerts, payment links, and emergency announcements across WhatsApp, SMS, and Email.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full w-fit">
            <Bell className="w-3.5 h-3.5" /> High-Throughput Gateway Active
          </span>
        </div>

        {sentSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Broadcast campaign queued and dispatched successfully to selected audience group!</span>
          </div>
        )}

        {/* Broadcast Composer & Recent Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Composer Form */}
          <form onSubmit={handleSendBroadcast} className="lg:col-span-2 p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-4 border-b border-slate-800">
              <Send className="w-4 h-4 text-cyan-400" />
              <span>Compose New Broadcast Campaign</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Communication Channel</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none cursor-pointer"
                  >
                    <option value="WhatsApp">WhatsApp Cloud API (Meta)</option>
                    <option value="SMS">Transactional SMS Gateway</option>
                    <option value="Email">SMTP Institutional Email</option>
                    <option value="Push">Mobile App Push Notification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Target Stakeholder Audience</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none cursor-pointer"
                  >
                    <option value="All Parents">All Enrolled Parents (1,480)</option>
                    <option value="Fee Defaulters">Fee Defaulters Only (142)</option>
                    <option value="Grade 10">Grade 10 Students & Parents</option>
                    <option value="Grade 12">Grade 12 Students & Parents</option>
                    <option value="Faculty">All Teaching Faculty (94)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <label className="block font-medium text-slate-300 mb-1">Broadcast Message Content</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your official announcement, fee notice, or emergency alert here..."
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 leading-relaxed resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-cyan-950 text-xs flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Broadcast Now</span>
              </button>
            </div>
          </form>

          {/* Broadcast Stats Sidebar */}
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 pb-4 border-b border-slate-800">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Delivery Performance</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                  <div className="text-slate-400">Total Messages (This Month)</div>
                  <div className="text-2xl font-extrabold text-white">48,290</div>
                  <div className="text-[10px] text-cyan-400">99.4% delivery success rate</div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                  <div className="text-slate-400">WhatsApp API Quota</div>
                  <div className="text-2xl font-extrabold text-white">250K / mo</div>
                  <div className="text-[10px] text-slate-400">Tier 2 Verified Business</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl text-[11px] text-cyan-300 leading-relaxed">
              All messages comply with TRAI & GDPR anti-spam regulations for educational institutions.
            </div>
          </div>
        </div>

        {/* Recent Campaigns Table */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              <span>Recent Broadcast Campaign Logs</span>
            </h3>
            <span className="text-xs text-slate-400">Tenant-scoped telemetry</span>
          </div>

          <div className="space-y-3 text-xs">
            {recentBroadcasts.map((item) => (
              <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.title}</div>
                  <div className="text-slate-400 flex items-center gap-3 text-[11px]">
                    <span>Channel: <strong className="text-slate-300">{item.channel}</strong></span>
                    <span>Audience: <strong className="text-slate-300">{item.audience}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full font-bold text-[10px]">
                    {item.status}
                  </span>
                  <span className="text-slate-500 text-[11px]">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
