'use client';

import React, { useState } from 'react';
import { Sparkles, BarChart3, TrendingUp, Users, Server, ArrowLeft, CheckCircle2, DollarSign, Activity, Globe, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsModule() {
  const [timeRange, setTimeRange] = useState('This Year (2026)');

  const tenantMetrics = [
    { school: 'St. Xavier International', tier: 'Professional', students: '4,850', arr: '$29,988', status: 'Healthy' },
    { school: 'Global Tech Institute', tier: 'Enterprise', students: '12,400', arr: '$54,000', status: 'Healthy' },
    { school: 'Cambridge Academy', tier: 'Starter', students: '1,200', arr: '$11,988', status: 'Healthy' },
    { school: 'Apex Research University', tier: 'Enterprise', students: '18,500', arr: '$65,000', status: 'High Usage' },
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
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus AI</h1>
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Enterprise Analytics & BI Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">SaaS Business Intelligence & Telemetry</h2>
            <p className="text-xs text-slate-400 mt-1">Real-time revenue metrics, multi-tenant adoption stats, and infrastructure throughput for ThomasG Technologies.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
            <span className="px-3 py-1.5 bg-cyan-600 text-white font-bold rounded-lg shadow-md">2026 Fiscal</span>
            <span className="px-3 py-1.5 text-slate-400">Live Stream</span>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Annual Recurring Revenue (ARR)</div>
            <div className="text-3xl font-extrabold text-white">$1,450,000</div>
            <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +38% YoY growth rate
            </div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Active School Tenants</div>
            <div className="text-3xl font-extrabold text-cyan-400">48 Campuses</div>
            <div className="text-[10px] text-slate-400">Over 160,000 active students</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">API Gateway Throughput</div>
            <div className="text-3xl font-extrabold text-white">18.4M req/day</div>
            <div className="text-[10px] text-emerald-400 font-medium">Zero packet loss</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Global Cluster Uptime</div>
            <div className="text-3xl font-extrabold text-emerald-400">99.99%</div>
            <div className="text-[10px] text-slate-400">Multi-region PostgreSQL sync</div>
          </div>
        </div>

        {/* Tenant Adoption & Revenue Table */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span>Top Institutional Tenants & ARR Contribution</span>
            </h3>
            <div className="text-xs text-slate-400">Updated in real-time via Kafka Mesh</div>
          </div>

          <div className="space-y-3 text-xs">
            {tenantMetrics.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.school} • <span className="text-cyan-400">{item.tier} Tier</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Enrolled Students: <strong className="text-slate-300">{item.students}</strong></span>
                    <span>Annual Contribution: <strong className="text-emerald-400 font-mono">{item.arr}</strong></span>
                  </div>
                </div>
                <div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold text-[10px]">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Analytics & Business Intelligence</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
