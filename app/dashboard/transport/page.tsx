'use client';

import { useState } from "react";

export default function TransportFleetPage() {
  const [buses, setBuses] = useState([
    { id: "BUS-01", route: "Route A: South Delhi & Greater Kailash", driver: "Ramesh Kumar", phone: "+91 98111 22334", students: 42, speed: "32 km/h", status: "On Route" },
    { id: "BUS-02", route: "Route B: Vasant Vihar & Dwarka", driver: "Suresh Singh", phone: "+91 98222 33445", students: 38, speed: "0 km/h (At Stop)", status: "At School" },
    { id: "BUS-03", route: "Route C: Noida Sector 62 & 15", driver: "Vijay Sharma", phone: "+91 98333 44556", students: 45, speed: "45 km/h", status: "On Route" },
    { id: "BUS-04", route: "Route D: Gurgaon Cyber City Corridor", driver: "Manoj Yadav", phone: "+91 98444 55667", students: 30, speed: "28 km/h", status: "Delayed (Traffic)" },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full font-semibold border border-indigo-500/20">
            Infrastructure Add-on
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Transport & Fleet Operations</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time GPS tracking, bus route telemetry, driver contacts, and parent transit alerts.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow">
          + Add New Vehicle Route
        </button>
      </div>

      {/* Fleet Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Fleet</div>
          <div className="text-3xl font-extrabold text-white mt-2">12 Buses</div>
          <div className="text-[11px] text-emerald-400 mt-1">100% GPS telemetry online</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Students in Transit</div>
          <div className="text-3xl font-extrabold text-indigo-400 mt-2">455</div>
          <div className="text-[11px] text-slate-500 mt-1">Checked in via RFID/App</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Routes</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">12 Routes</div>
          <div className="text-[11px] text-slate-500 mt-1">Optimized by AI routing</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Fleet Alerts</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">1 Delay</div>
          <div className="text-[11px] text-amber-400 mt-1">Route D experiencing heavy traffic</div>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200">
          Active Fleet Telemetry & Manifests
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Bus ID</th>
                <th className="px-6 py-3 font-semibold">Route Details</th>
                <th className="px-6 py-3 font-semibold">Driver Name</th>
                <th className="px-6 py-3 font-semibold">Phone Number</th>
                <th className="px-6 py-3 font-semibold">Manifest</th>
                <th className="px-6 py-3 font-semibold">Live Speed</th>
                <th className="px-6 py-3 font-semibold">Telemetry Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {buses.map((bus: any) => (
                <tr key={bus.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono font-bold text-indigo-400">{bus.id}</td>
                  <td className="px-6 py-4 text-white font-medium">{bus.route}</td>
                  <td className="px-6 py-4 text-slate-300">{bus.driver}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">{bus.phone}</td>
                  <td className="px-6 py-4 text-slate-300">{bus.students} students</td>
                  <td className="px-6 py-4 font-mono text-slate-300">{bus.speed}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      bus.status === "On Route" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : bus.status === "At School"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {bus.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-slate-400 hover:text-white font-medium">GPS Map</button>
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">Manifest</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
