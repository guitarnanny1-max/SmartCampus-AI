export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { Sparkles, Code, Terminal, Key, Webhook, CheckCircle2, ArrowLeft, Copy, Shield, Activity, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function DeveloperHubModule() {
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState('sc_live_sec_994821038475892011384');

  const [webhookLogs, setWebhookLogs] = useState([
    { id: 1, event: 'payment.success', endpoint: 'https://api.delhipublic.edu.in/webhooks/fees', status: '200 OK', time: '2 mins ago' },
    { id: 2, event: 'bus.gps.update', endpoint: 'https://api.delhipublic.edu.in/webhooks/transit', status: '200 OK', time: '5 mins ago' },
    { id: 3, event: 'student.attendance', endpoint: 'https://api.delhipublic.edu.in/webhooks/attendance', status: '201 Created', time: '12 mins ago' },
  ]);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
            <span className="text-[10px] text-slate-400">Developer API & Webhook Telemetry Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Developer API & Webhooks</h2>
            <p className="text-xs text-slate-400 mt-1">Manage tenant API keys, test REST endpoints, and inspect real-time webhook delivery logs.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full w-fit">
            <Terminal className="w-3.5 h-3.5" /> GraphQL & REST v2 Active
          </span>
        </div>

        {/* API Key Management Card */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Production API Secret Key</span>
            </h3>
            <span className="text-xs text-slate-400">Scoped to current tenant schema</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="password"
                readOnly
                value={apiKey}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-cyan-400 font-mono focus:outline-none"
              />
              <button
                onClick={handleCopyKey}
                className="w-full sm:w-auto px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Secret Key'}</span>
              </button>
            </div>
            <p className="text-slate-400">Never expose your secret key in client-side code. Use server-side environment variables for backend API calls.</p>
          </div>
        </div>

        {/* Webhook Logs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick cURL Example */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <span>Quick Start (cURL)</span>
            </h3>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-[11px] text-slate-300 overflow-x-auto space-y-2">
              <p className="text-slate-500"># Fetch active student records</p>
              <p className="text-cyan-400">curl -X GET \</p>
              <p className="pl-4">https://api.smartcampus.io/v2/students \</p>
              <p className="pl-4">-H "Authorization: Bearer sc_live_..."</p>
            </div>
            <Link href="https://docs.smartcampus.io" target="_blank" className="text-cyan-400 hover:underline text-xs inline-block pt-1">
              Read Full API Documentation →
            </Link>
          </div>

          {/* Real-time Webhook Deliveries */}
          <div className="lg:col-span-2 p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Webhook className="w-5 h-5 text-cyan-400" />
                <span>Live Webhook Delivery Stream</span>
              </h3>
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Listening for events
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {webhookLogs.map((log: any) => (
                <div key={log.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-bold text-white font-mono">{log.event}</div>
                    <div className="text-slate-400 font-mono text-[11px] truncate max-w-md">{log.endpoint}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full font-bold text-[10px]">
                      {log.status}
                    </span>
                    <span className="text-slate-500 text-[10px]">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
