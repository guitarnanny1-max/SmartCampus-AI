'use client';

import React, { useState } from 'react';
import { Sparkles, BarChart3, TrendingUp, Download, Building2, Calendar, ArrowLeft, CheckCircle2, Users, DollarSign, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsModule() {
  const [tenant, setTenant] = useState('Delhi Public International');
  const [timeRange, setTimeRange] = useState('Q2 2026');
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportReport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus SaaS OS</h1>
              <span className="text-[10px] text-slate-400">Institutional Business Intelligence & BI</span>
            </div>
          </div>

          <Link href="/" className="md:hidden flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap text-xs">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="Delhi Public International">Tenant: Delhi Public Intl</option>
              <option value="Metro Global Academy">Tenant: Metro Global Academy</option>
              <option value="All Tenants">All Tenants Consolidated</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="Q1 2026">Q1 2026</option>
              <option value="Q2 2026">Q2 2026</option>
              <option value="Academic Year 2025-26">Academic Year 2025-26</option>
            </select>
          </div>

          <Link href="/" className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors pl-2 border-l border-slate-800">
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Analytics</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Analytics & Performance BI • {tenant}</h2>
            <p className="text-xs text-slate-400 mt-1">Real-time aggregation of student admissions velocity, tuition fee reconciliation, and academic success rates.</p>
          </div>
          <button
            onClick={handleExportReport}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Download className="w-4 h-4" />
            <span>Export Executive PDF Report</span>
          </button>
        </div>

        {exportSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Executive analytics report generated and downloaded successfully!</span>
          </div>
        )}

        {/* Analytics KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Total Tuition Collected</div>
            <div className="text-3xl font-extrabold text-white">₹1.84 Crores</div>
            <div className="text-[10px] text-cyan-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.2% vs previous quarter
            </div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Net Enrollment Growth</div>
            <div className="text-3xl font-extrabold text-white">+248 Students</div>
            <div className="text-[10px] text-cyan-400 font-medium">94.5% retention rate</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Average Academic Score</div>
            <div className="text-3xl font-extrabold text-cyan-400">88.4%</div>
            <div className="text-[10px] text-slate-400">CBSE/ICSE benchmarks exceeded</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Bus Telemetry Uptime</div>
            <div className="text-3xl font-extrabold text-white">99.9%</div>
            <div className="text-[10px] text-cyan-400 font-medium">Zero transit downtime</div>
          </div>
        </div>

        {/* Charts & Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Breakdown */}
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              <span>Revenue Stream Breakdown</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Tuition & Core Fees</span>
                  <span className="text-white font-bold">₹1.42 Cr (77%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-cyan-500 h-full rounded-full w-[77%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Transport & Bus Fees</span>
                  <span className="text-white font-bold">₹28 Lakhs (15%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-blue-500 h-full rounded-full w-[15%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Laboratory & Activities</span>
                  <span className="text-white font-bold">₹14 Lakhs (8%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-indigo-500 h-full rounded-full w-[8%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Departmental Performance */}
          <div className="lg:col-span-2 p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span>Multi-Tenant Comparative Performance</span>
              </h3>
              <span className="text-xs text-slate-400">Metrics across active tenants</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Delhi Public International</div>
                  <div className="text-slate-400">Active Students: 1,480 • Fee Collection: 98.2%</div>
                </div>
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full font-bold">
                  Top Performing
                </span>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Metro Global Academy</div>
                  <div className="text-slate-400">Active Students: 1,220 • Fee Collection: 94.8%</div>
                </div>
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-full font-bold">
                  Steady Growth
                </span>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">St. Xavier Collegiate</div>
                  <div className="text-slate-400">Active Students: 1,150 • Fee Collection: 91.5%</div>
                </div>
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-full font-bold">
                  Stable
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
