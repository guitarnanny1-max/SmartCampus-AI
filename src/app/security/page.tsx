export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { Sparkles, Shield, Video, AlertTriangle, Lock, ArrowLeft, CheckCircle2, Search, Bell, Eye } from 'lucide-react';
import Link from 'next/link';

export default function SecurityModule() {
  const [sosSuccess, setSosSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const securityLedger = [
    { zone: 'Main Entrance Gate & Perimeter', cameras: '120 AI Cameras Active', ai: 'Facial Recognition & LPR', patrol: 'Mobile Unit Alpha', status: 'Secure' },
    { zone: 'Science & Research Quad', cameras: '85 Thermal & Optical', ai: 'Perimeter Intrusion Detection', patrol: 'Stationary Guard Post', status: 'Monitoring' },
    { zone: 'Hostel Residential Zone', cameras: '210 Biometric Turnstiles', ai: 'Unauthorized Tailgating Alert', patrol: 'Night Warden Patrol', status: 'Secure' },
    { zone: 'Central Data Center & Server Vault', cameras: '30 Multi-Factor Cams', ai: 'Iris & Dual-Auth Vault Lock', patrol: 'Armed Security Detail', status: 'Locked Optimal' },
  ];

  const handleTriggerSOS = () => {
    setSosSuccess(true);
    setTimeout(() => setSosSuccess(false), 3500);
  };

  const filteredSecurity = securityLedger.filter((item: any) => 
    item.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.ai.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.patrol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus AI</h1>
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Campus Security & Surveillance Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Campus Security, Emergency & AI Surveillance</h2>
            <p className="text-xs text-slate-400 mt-1">Manage real-time CCTV surveillance AI analytics, perimeter intrusion alerts, emergency SOS panic dispatch, and smart gate access logs.</p>
          </div>
          <button
            onClick={handleTriggerSOS}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-rose-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Trigger Campus Emergency SOS Dispatch</span>
          </button>
        </div>

        {sosSuccess && (
          <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Emergency SOS broadcasted successfully! Campus security rapid response unit and local medical dispatch notified with live GPS coordinates.</span>
          </div>
        )}

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Active AI Cameras</div>
            <div className="text-3xl font-extrabold text-white">1,420 Units</div>
            <div className="text-[10px] text-slate-400">100% cloud & edge telemetry uptime</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Perimeter Threat Prevention</div>
            <div className="text-3xl font-extrabold text-emerald-400">100% Secure</div>
            <div className="text-[10px] text-emerald-400 font-medium">Zero unauthorized breach recorded</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Emergency Response SLA</div>
            <div className="text-3xl font-extrabold text-cyan-400">&lt; 45 seconds</div>
            <div className="text-[10px] text-slate-400">Automated drone & guard dispatch</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Defcon Status</div>
            <div className="text-3xl font-extrabold text-emerald-400">Level 1 (Optimal)</div>
            <div className="text-[10px] text-slate-400">Normal operational posture</div>
          </div>
        </div>

        {/* Security Ledger */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-cyan-400" />
              <span>Surveillance Zones & Perimeter Security Ledger</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search zone, AI feature, status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredSecurity.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.zone} • <span className="text-cyan-400">{item.cameras}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>AI Analytics: <strong className="text-emerald-400">{item.ai}</strong></span>
                    <span>Patrol Force: <strong className="text-slate-300">{item.patrol}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold text-[10px]">
                    {item.status}
                  </span>
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-400 font-medium transition-colors cursor-pointer">
                    View Live Feed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Campus Security & Surveillance Hub</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
