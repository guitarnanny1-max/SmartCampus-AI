'use client';

import React, { useState } from 'react';
import { Sparkles, Bus, MapPin, Navigation, ShieldCheck, Users, ArrowLeft, CheckCircle2, Clock, Activity, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TransitModule() {
  const [selectedRoute, setSelectedRoute] = useState('Route 12 - South Delhi & Greater Kailash');
  const [dispatchAlert, setDispatchAlert] = useState(false);

  const buses = [
    { id: 1, route: 'Route 12 - South Delhi & Greater Kailash', busNumber: 'DL-1PC-9948', driver: 'Rajesh Kumar', studentsOnboard: 38, speed: '42 km/h', status: 'In Transit', eta: '12 mins' },
    { id: 2, route: 'Route 04 - Vasant Vihar & Chanakyapuri', busNumber: 'DL-1PC-1024', driver: 'Suresh Sharma', studentsOnboard: 42, speed: '0 km/h', status: 'Arrived at Campus', eta: 'Arrived' },
    { id: 3, route: 'Route 09 - Saket & Malviya Nagar', busNumber: 'DL-1PC-8831', driver: 'Amit Singh', studentsOnboard: 29, speed: '35 km/h', status: 'In Transit', eta: '24 mins' },
  ];

  const handleTriggerAlert = () => {
    setDispatchAlert(true);
    setTimeout(() => setDispatchAlert(false), 3500);
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
            <span className="text-[10px] text-slate-400">Real-Time Transit & GPS Fleet Tracking</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Smart Bus Fleet & GPS Telemetry</h2>
            <p className="text-xs text-slate-400 mt-1">Live tracking of institutional transport, RFID student boarding scans, and automated parent arrival notifications.</p>
          </div>
          <button
            onClick={handleTriggerAlert}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Navigation className="w-4 h-4" />
            <span>Broadcast Route Delay Alert</span>
          </button>
        </div>

        {dispatchAlert && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Transit delay alert broadcasted successfully to all parents on the active route!</span>
          </div>
        )}

        {/* Transit KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Active Fleet Buses</div>
            <div className="text-3xl font-extrabold text-white">24 Units</div>
            <div className="text-[10px] text-cyan-400 font-medium">100% GPS telemetry active</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Students in Transit</div>
            <div className="text-3xl font-extrabold text-white">1,120</div>
            <div className="text-[10px] text-cyan-400 font-medium">RFID scanned boarding verified</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Average Punctuality</div>
            <div className="text-3xl font-extrabold text-emerald-400">98.4%</div>
            <div className="text-[10px] text-slate-400">On-time campus arrivals</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Safety Speed Compliance</div>
            <div className="text-3xl font-extrabold text-white">100%</div>
            <div className="text-[10px] text-cyan-400 font-medium">Zero overspeeding alerts</div>
          </div>
        </div>

        {/* Fleet Grid & Live Map Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Buses List */}
          <div className="lg:col-span-1 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Bus className="w-4 h-4 text-cyan-400" />
              <span>Active Bus Routes</span>
            </h3>

            <div className="space-y-3 text-xs">
              {buses.map((bus) => (
                <div
                  key={bus.id}
                  onClick={() => setSelectedRoute(bus.route)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedRoute === bus.route
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-white">{bus.route}</div>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      bus.status === 'In Transit' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {bus.status}
                    </span>
                  </div>
                  <div className="text-slate-400 flex items-center justify-between text-[11px]">
                    <span>Bus: <strong className="text-slate-300">{bus.busNumber}</strong></span>
                    <span>Speed: <strong className="text-slate-300">{bus.speed}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Telemetry Map Simulation */}
          <div className="lg:col-span-2 p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>Live Telemetry • {selectedRoute}</span>
              </h3>
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Live GPS Signal
              </span>
            </div>

            {/* Map Placeholder Graphic */}
            <div className="relative h-64 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-2">
                <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/50 rounded-full flex items-center justify-center mx-auto animate-bounce text-cyan-400 shadow-xl shadow-cyan-950">
                  <Bus className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-white bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
                  Latitude: 28.5355° N, Longitude: 77.2310° E
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl text-xs space-y-0.5 backdrop-blur-md">
                <div className="text-slate-400">Driver: <strong className="text-white">Rajesh Kumar (+91 98210 XXXXX)</strong></div>
                <div className="text-slate-400">Estimated Campus Arrival: <strong className="text-cyan-400">12 minutes</strong></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
