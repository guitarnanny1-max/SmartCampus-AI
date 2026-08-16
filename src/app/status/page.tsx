'use client';

import React, { useState } from 'react';
import { Sparkles, Server, ShieldCheck, Activity, CheckCircle2, ArrowLeft, Globe, RefreshCw, Cpu, Database } from 'lucide-react';
import Link from 'next/link';

export default function SystemStatusModule() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState('Just now');

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastChecked('Just now');
    }, 1000);
  };

  const services = [
    { name: 'Multi-Tenant PostgreSQL Cluster (AWS RDS)', status: 'Operational', latency: '12ms', uptime: '99.99%' },
    { name: 'Redis Distributed Caching & Session Store', status: 'Operational', latency: '2ms', uptime: '100%' },
    { name: 'WhatsApp Cloud API Gateway (Meta)', status: 'Operational', latency: '84ms', uptime: '99.95%' },
    { name: 'Razorpay / Stripe Payment Processing Engine', status: 'Operational', latency: '145ms', uptime: '99.99%' },
    { name: 'AI LLM Copilot Inference Engine', status: 'Operational', latency: '320ms', uptime: '99.90%' },
    { name: 'Real-Time Bus GPS Telemetry WebSocket Server', status: 'Operational', latency: '18ms', uptime: '99.98%' },
  ];

  const regions = [
    { name: 'Asia-South (Mumbai)', status: 'Operational', latency: '14ms' },
    { name: 'Asia-East (Singapore)', status: 'Operational', latency: '48ms' },
    { name: 'US-East (Virginia)', status: 'Operational', latency: '112ms' },
    { name: 'EU-Central (Frankfurt)', status: 'Operational', latency: '98ms' },
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
            <span className="text-[10px] text-slate-400">Global Cluster Health & System Telemetry</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">System Status & Infrastructure Health</h2>
            <p className="text-xs text-slate-400 mt-1">Real-time monitoring of all microservices, database isolation schemas, and regional cloud gateways.</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer w-fit"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Last checked: {lastChecked}</span>
          </button>
        </div>

        {/* Overall Status Banner */}
        <div className="p-6 bg-cyan-950/30 border border-cyan-500/30 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/40 rounded-2xl flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">All Systems Fully Operational</h3>
              <p className="text-xs text-cyan-300/80">100% of institutional tenants are running with zero downtime across all active clusters.</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Operational
          </span>
        </div>

        {/* Microservices Grid */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <span>Core Microservices & Gateways</span>
            </h3>
            <span className="text-xs text-slate-400">Multi-tenant architecture</span>
          </div>

          <div className="space-y-3 text-xs">
            {services.map((svc, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-sm">{svc.name}</div>
                  <div className="text-slate-400 text-[11px]">Response Latency: <strong className="text-slate-300">{svc.latency}</strong> • Uptime: <strong className="text-cyan-400">{svc.uptime}</strong></div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full font-bold text-[10px] w-fit">
                  {svc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Edge Nodes */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span>Regional Edge CDN & Routing Nodes</span>
            </h3>
            <span className="text-xs text-slate-400">Global latency telemetry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {regions.map((reg, idx) => (
              <div key={idx} className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-white text-sm">{reg.name}</div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-slate-400 text-xs">Latency: <strong className="text-cyan-400">{reg.latency}</strong></div>
                <div className="text-[10px] text-emerald-400 font-medium">{reg.status}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
