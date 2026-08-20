'use client';

import React, { useState } from 'react';
import { 
  Bus, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Route, 
  Users,
  Navigation
} from 'lucide-react';
import Link from 'next/link';

export default function TransportPortal() {
  const [buses] = useState([
    { id: 'BUS-01', route: 'R-14 (Vasant Vihar)', driver: 'Rajesh Kumar', status: 'On Route', occupancy: '42/50', delay: 'None' },
    { id: 'BUS-02', route: 'R-08 (Dwarka Sec-11)', driver: 'Suresh Singh', status: 'Delayed', occupancy: '38/45', delay: '15 mins' },
    { id: 'BUS-03', route: 'R-22 (Saket)', driver: 'Amit Patel', status: 'Arrived', occupancy: '0/50', delay: 'None' },
    { id: 'BUS-04', route: 'R-05 (Janakpuri)', driver: 'Vikram Sharma', status: 'On Route', occupancy: '45/45', delay: 'None' }
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[10px] font-mono rounded-full uppercase">
                Portal: Transport & Logistics
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">Fleet Management 🚌</h1>
            <p className="text-slate-400 text-sm">Delhi Public School • Vehicle Tracking & Routes</p>
          </div>
          <div className="flex gap-3">
             <Link href="/dashboard" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-colors">
                Master Hub
             </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Bus className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-slate-400 font-mono">Active Fleet</span>
            </div>
            <span className="text-2xl font-bold text-white">24</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Route className="w-5 h-5 text-indigo-400" />
              <span className="text-xs text-slate-400 font-mono">Total Routes</span>
            </div>
            <span className="text-2xl font-bold text-white">18</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-slate-400 font-mono">Students Boarded</span>
            </div>
            <span className="text-2xl font-bold text-white">845</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="text-xs text-slate-400 font-mono">Route Delays</span>
            </div>
            <span className="text-2xl font-bold text-white">1</span>
          </div>
        </div>

        {/* Live Tracking Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-indigo-400" />
              Live Fleet Status
            </h2>
            <button className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors">
              Refresh GPS
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="p-4 font-semibold">Bus ID</th>
                  <th className="p-4 font-semibold">Route</th>
                  <th className="p-4 font-semibold">Driver</th>
                  <th className="p-4 font-semibold">Occupancy</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {buses.map((bus, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-sm text-slate-300 font-medium">{bus.id}</td>
                    <td className="p-4 text-sm text-slate-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" /> {bus.route}
                    </td>
                    <td className="p-4 text-sm text-slate-400">{bus.driver}</td>
                    <td className="p-4 text-sm text-slate-400">{bus.occupancy}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        bus.status === 'On Route' ? 'bg-emerald-500/10 text-emerald-400' :
                        bus.status === 'Delayed' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-slate-500/10 text-slate-400'
                      }`}>
                        {bus.status === 'On Route' && <Clock className="w-3 h-3" />}
                        {bus.status === 'Delayed' && <AlertTriangle className="w-3 h-3" />}
                        {bus.status === 'Arrived' && <CheckCircle2 className="w-3 h-3" />}
                        {bus.status}
                        {bus.delay !== 'None' && ` (${bus.delay})`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
