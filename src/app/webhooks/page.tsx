'use client';

import React, { useState } from 'react';
import { Sparkles, Webhook, Radio, ArrowLeft, CheckCircle2, Search, Send, Activity, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function WebhooksModule() {
  const [webhookSuccess, setWebhookSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const webhookEvents = [
    { id: 1, eventType: 'fee.payment.success', targetUrl: 'https://api.smartcampus.io/v1/webhooks/stripe', status: '200 OK', latency: '42ms', timestamp: '2 mins ago' },
    { id: 2, eventType: 'bus.gps.update', targetUrl: 'https://transit.smartcampus.io/telemetry', status: '200 OK', latency: '18ms', timestamp: '5 mins ago' },
    { id: 3, eventType: 'student.attendance.marked', targetUrl: 'https://api.smartcampus.io/v1/webhooks/sms', status: '200 OK', latency: '35ms', timestamp: '12 mins ago' },
    { id: 4, eventType: 'library.book.overdue', targetUrl: 'https://api.smartcampus.io/v1/webhooks/whatsapp', status: '200 OK', latency: '64ms', timestamp: '25 mins ago' },
  ];

  const handleTestWebhook = () => {
    setWebhookSuccess(true);
    setTimeout(() => setWebhookSuccess(false), 3500);
  };

  const filteredEvents = webhookEvents.filter(ev => 
    ev.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.targetUrl.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-[10px] text-slate-400">Real-Time Notification & Webhook Router Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Notification Webhook & Event Router</h2>
            <p className="text-xs text-slate-400 mt-1">Manage real-time event dispatching, WhatsApp Cloud API webhooks, payment gateway triggers, and delivery latency metrics.</p>
          </div>
          <button
            onClick={handleTestWebhook}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Test Webhook Event</span>
          </button>
        </div>

        {webhookSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Test webhook payload dispatched successfully and acknowledged with 200 OK status!</span>
          </div>
        )}

        {/* Webhook KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Events Dispatched Today</div>
            <div className="text-3xl font-extrabold text-white">48,920 Events</div>
            <div className="text-[10px] text-cyan-400 font-medium">100% delivery success rate</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Average Router Latency</div>
            <div className="text-3xl font-extrabold text-emerald-400">28 ms</div>
            <div className="text-[10px] text-slate-400">High-performance Redis queue</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Active Webhook Endpoints</div>
            <div className="text-3xl font-extrabold text-white">14 Subscribers</div>
            <div className="text-[10px] text-cyan-400 font-medium">Encrypted HMAC SHA-256 signatures</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">WhatsApp API Status</div>
            <div className="text-3xl font-extrabold text-emerald-400">Connected</div>
            <div className="text-[10px] text-slate-400">Official Cloud API active</div>
          </div>
        </div>

        {/* Webhook Logs Table */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              <span>Real-Time Event Dispatch Roster</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search event type or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredEvents.map((ev) => (
              <div key={ev.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm font-mono">{ev.eventType}</div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px] font-mono">
                    <span>Target: <strong className="text-slate-300">{ev.targetUrl}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full font-bold text-[10px] font-mono">
                    {ev.status}
                  </span>
                  <span className="text-cyan-400 font-mono text-[11px]">{ev.latency}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{ev.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
