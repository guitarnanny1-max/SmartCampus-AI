'use client';

import React, { useState } from 'react';
import { Sparkles, Cpu, Zap, Droplets, Activity, ArrowLeft, CheckCircle2, Search } from 'lucide-react';
import Link from 'next/link';

export default function FacilitiesModule() {
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const gridLedger = [
    { zone: 'Academic Block A & B', solar: '850 kW/h', hvac: 'Optimized (22°C)', water: '98% Recycled', status: 'Optimal' },
    { zone: 'Research & Innovation Hub', solar: '1.2 MW/h', hvac: 'Precision Cleanroom', water: '100% Recycled', status: 'Optimal' },
    { zone: 'Central Library & Auditorium', solar: '450 kW/h', hvac: 'Smart Zone Cooling', water: '95% Recycled', status: 'Optimal' },
    { zone: 'Sports Complex & Indoor Arena', solar: '300 kW/h', hvac: 'Natural Ventilation', water: 'Rainwater Harvesting', status: 'Optimal' },
  ];

  const handleOptimize = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3500);
  };

  const filtered = gridLedger.filter(item => 
    item.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Energy & Facilities Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Smart Energy & IoT Facilities</h2>
            <p className="text-xs text-slate-400 mt-1">Manage campus-wide solar microgrids, HVAC automation, smart water recycling, and IoT telemetry.</p>
          </div>
          <button onClick={handleOptimize} className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit">
            <Zap className="w-4 h-4" />
            <span>Run AI Grid Optimization</span>
          </button>
        </div>

        {success && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>AI Grid Optimization complete! Campus carbon offset increased by 14.2% with zero load shedding.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Total Solar Generation</div>
            <div className="text-3xl font-extrabold text-emerald-400">2.8 MW/h</div>
            <div className="text-[10px] text-emerald-400">100% renewable daytime offset</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">HVAC Efficiency</div>
            <div className="text-3xl font-extrabold text-white">99.4%</div>
            <div className="text-[10px] text-slate-400">IoT sensor automated cooling</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Water Recycling Rate</div>
            <div className="text-3xl font-extrabold text-cyan-400">96.8%</div>
            <div className="text-[10px] text-slate-400">Zero wastewater discharge</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Active IoT Sensors</div>
            <div className="text-3xl font-extrabold text-white">1,420 Units</div>
            <div className="text-[10px] text-slate-400">Real-time edge telemetry</div>
          </div>
        </div>

        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>Campus Zones & Microgrid Telemetry Ledger</span>
            </h3>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search zone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="space-y-3 text-xs">
            {filtered.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.zone}</div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Solar: <strong className="text-emerald-400">{item.solar}</strong></span>
                    <span>HVAC: <strong className="text-slate-300">{item.hvac}</strong></span>
                    <span>Water: <strong className="text-cyan-400">{item.water}</strong></span>
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
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Energy & Facilities Hub</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
