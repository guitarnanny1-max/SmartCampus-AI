'use client';

import React, { useState } from 'react';
import { Sparkles, Bus, MapPin, Shield, Clock, Activity, ArrowLeft, Navigation, CheckCircle2, AlertTriangle, Phone } from 'lucide-react';
import Link from 'next/link';

export default function TransportModule() {
  const [selectedBus, setSelectedBus] = useState('Bus 101 - North Sector');

  const buses = [
    { id: 'Bus 101 - North Sector', driver: 'Ramesh Kumar', phone: '+91 98111 22334', route: 'Civil Lines → Model Town → Campus', speed: '38 km/h', status: 'On Schedule', students: 42, eta: '08:15 AM' },
    { id: 'Bus 102 - South Avenue', driver: 'Suresh Singh', phone: '+91 98222 33445', route: 'Greater Kailash → Nehru Place → Campus', speed: '45 km/h', status: 'On Schedule', students: 38, eta: '08:20 AM' },
    { id: 'Bus 103 - Cyber City Express', driver: 'Manoj Sharma', phone: '+91 98333 44556', route: 'DLF Phase 3 → MG Road → Campus', speed: '28 km/h', status: 'Minor Delay (Traffic)', students: 45, eta: '08:32 AM' },
  ];

  const currentBusData = buses.find(b => b.id === selectedBus) || buses[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus OS</h1>
            <span className="text-[10px] text-slate-400">GPS Telemetry & Fleet Management</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Live Fleet Telemetry & Bus Tracking</h2>
            <p className="text-xs text-slate-400 mt-1">Real-time GPS tracking, speed monitoring, and automated parent transit notifications.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full w-fit">
            <Navigation className="w-3.5 h-3.5 animate-pulse" /> Live Telemetry Feed Active
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Active Fleet Buses</div>
            <div className="text-3xl font-extrabold mt-2">24 / 24</div>
            <div className="text-[10px] text-cyan-400 mt-1">100% operational status</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Students in Transit</div>
            <div className="text-3xl font-extrabold mt-2">1,120</div>
            <div className="text-[10px] text-cyan-400 mt-1">RFID boarded verified</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">On-Time Arrival Rate</div>
            <div className="text-3xl font-extrabold mt-2">98.4%</div>
            <div className="text-[10px] text-cyan-400 mt-1">Based on weekly average</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Geofence Alerts</div>
            <div className="text-3xl font-extrabold mt-2 text-cyan-400">0</div>
            <div className="text-[10px] text-slate-400 mt-1">No security breaches</div>
          </div>
        </div>

        {/* Fleet Selector & Map Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bus Selector Sidebar */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bus className="w-4 h-4 text-cyan-400" />
              <span>Select Active Bus</span>
            </h3>

            <div className="space-y-3">
              {buses.map((bus) => (
                <button
                  key={bus.id}
                  onClick={() => setSelectedBus(bus.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedBus === bus.id
                      ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">{bus.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      bus.status.includes('Delay') ? 'bg-amber-500/10 text-amber-400' : 'bg-cyan-500/10 text-cyan-400'
                    }`}>
                      {bus.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{bus.route}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Bus Telemetry Details & Map Display */}
          <div className="lg:col-span-2 p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>Telemetry: {currentBusData.id}</span>
              </h3>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30">
                Speed: {currentBusData.speed}
              </span>
            </div>

            {/* Map Simulation Box */}
            <div className="h-64 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0,transparent_70%)]" />
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="w-96 h-96 border border-cyan-500/30 rounded-full animate-ping" />
              </div>
              <div className="relative z-10 text-center space-y-2">
                <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/50">
                  <Bus className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-sm font-bold text-white">{currentBusData.id}</div>
                <div className="text-xs text-cyan-400">GPS Coordinates: 28.6139° N, 77.2090° E (En Route to Campus)</div>
              </div>
            </div>

            {/* Driver & Transit Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-slate-400">Assigned Driver</div>
                <div className="font-bold text-white">{currentBusData.driver}</div>
                <div className="text-cyan-400 flex items-center gap-1 pt-1">
                  <Phone className="w-3 h-3" /> {currentBusData.phone}
                </div>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-slate-400">Expected Arrival (ETA)</div>
                <div className="font-bold text-white text-base">{currentBusData.eta}</div>
                <div className="text-cyan-400">Status: {currentBusData.status}</div>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-slate-400">Boarded Students</div>
                <div className="font-bold text-white text-base">{currentBusData.students} Students</div>
                <div className="text-cyan-400">RFID Attendance Synced</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
