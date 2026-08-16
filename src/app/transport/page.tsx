'use client';

import React, { useState } from 'react';
import { Sparkles, Bus, Car, Navigation, Shield, ArrowLeft, CheckCircle2, Search, MapPin, Gauge } from 'lucide-react';
import Link from 'next/link';

export default function TransportModule() {
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const transportLedger = [
    { route: 'Route A (City Center Express)', vehicle: 'EV Bus #04 (60 Seater)', driver: 'Ramesh Kumar', gps: 'Live • Speed 38 km/h', status: 'On Schedule' },
    { route: 'Route B (Tech Park & Metro Link)', vehicle: 'Electric Shuttle #12', driver: 'Suresh Patel', gps: 'Live • En Route Gate 3', status: 'On Schedule' },
    { route: 'Research Quad Shuttle Service', vehicle: 'Autonomous Pod #02', driver: 'AI Auto-Pilot', gps: 'Docked & Charging', status: 'Standby' },
    { route: 'Inter-Campus Research Transit', vehicle: 'Executive Van #01', driver: 'Anil Singh', gps: 'Live • Highway 48', status: 'Delayed (10m)' },
  ];

  const handleDispatchShuttle = () => {
    setDispatchSuccess(true);
    setTimeout(() => setDispatchSuccess(false), 3500);
  };

  const filteredTransport = transportLedger.filter(item => 
    item.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Transport & Fleet Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Transport, Fleet & Parking Management</h2>
            <p className="text-xs text-slate-400 mt-1">Manage real-time GPS fleet tracking, electric shuttle dispatch, smart parking slot allocations, and automated gate telemetry.</p>
          </div>
          <button
            onClick={handleDispatchShuttle}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Bus className="w-4 h-4" />
            <span>Dispatch Emergency EV Shuttle</span>
          </button>
        </div>

        {dispatchSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Emergency EV shuttle successfully dispatched and live route synchronized with student commuter app.</span>
          </div>
        )}

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Active Fleet Vehicles</div>
            <div className="text-3xl font-extrabold text-white">42 Units</div>
            <div className="text-[10px] text-slate-400">100% electric & hybrid buses</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Daily Commuter Ridership</div>
            <div className="text-3xl font-extrabold text-emerald-400">8,450 Riders</div>
            <div className="text-[10px] text-emerald-400 font-medium">Students & faculty transit</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Smart Parking Capacity</div>
            <div className="text-3xl font-extrabold text-cyan-400">1,240 / 1,500</div>
            <div className="text-[10px] text-slate-400">IoT sensor slots available</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Fleet Efficiency Score</div>
            <div className="text-3xl font-extrabold text-white">99.4%</div>
            <div className="text-[10px] text-slate-400">Optimized AI routing engine</div>
          </div>
        </div>

        {/* Transport Ledger */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-cyan-400" />
              <span>Fleet GPS Tracking & Transit Routes Ledger</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search route, vehicle, driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredTransport.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.route} • <span className="text-cyan-400">{item.vehicle}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Driver: <strong className="text-slate-300">{item.driver}</strong></span>
                    <span>GPS Telemetry: <strong className="text-emerald-400 font-mono">{item.gps}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    item.status === 'On Schedule' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    item.status === 'Standby' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.status}
                  </span>
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-400 font-medium transition-colors cursor-pointer">
                    View Live Map
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Transport & Fleet Management</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
