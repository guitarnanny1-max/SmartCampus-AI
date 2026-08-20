'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartTransportationPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleId, setVehicleId] = useState('');
  const [routeIdentifier, setRouteIdentifier] = useState('');
  const [podVelocityKph, setPodVelocityKph] = useState('450.0');
  const [magneticSuspensionStabilityPct, setMagneticSuspensionStabilityPct] = useState('99.9');
  const [passengerOccupancy, setPassengerOccupancy] = useState('12');
  const [aiTrafficRoutingMode, setAiTrafficRoutingMode] = useState('DYNAMIC_PREDICTIVE_FLOW_OPTIMIZATION');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-transportation')
      .then(res => res.json())
      .then(data => {
        setVehicles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-transportation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId, routeIdentifier, podVelocityKph, magneticSuspensionStabilityPct, passengerOccupancy, aiTrafficRoutingMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register vehicle');

      setVehicles([data, ...vehicles]);
      setVehicleId('');
      setRouteIdentifier('');
      alert('Vehicle registered successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                SMART AUTONOMOUS TRANSPORTATION & HYPERLOOP HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Hyperloop & Autonomous Transit Grid</h1>
            <p className="text-xs text-slate-400">Monitor vehicle speed (km/h), suspension stability, occupancy, and AI traffic routing optimization.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddVehicle} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🚇</span> Register Transit Vehicle
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Vehicle ID</label>
              <input 
                type="text" 
                placeholder="e.g. HYPER-POD-004" 
                value={vehicleId} 
                onChange={e => setVehicleId(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Route Identifier</label>
              <input 
                type="text" 
                placeholder="e.g. SCIENCE-WING-EXPRESS" 
                value={routeIdentifier} 
                onChange={e => setRouteIdentifier(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Velocity (km/h)</label>
              <input 
                type="number" 
                step="1.0" 
                value={podVelocityKph} 
                onChange={e => setPodVelocityKph(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Stability (%)</label>
              <input 
                type="number" 
                step="0.01" 
                value={magneticSuspensionStabilityPct} 
                onChange={e => setMagneticSuspensionStabilityPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Occupancy</label>
              <input 
                type="number" 
                value={passengerOccupancy} 
                onChange={e => setPassengerOccupancy(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Routing Mode</label>
              <select 
                value={aiTrafficRoutingMode} 
                onChange={e => setAiTrafficRoutingMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="DYNAMIC_PREDICTIVE_FLOW_OPTIMIZATION">Dynamic Predictive Flow</option>
                <option value="AUTONOMOUS_SWARM_INTELLIGENCE">Autonomous Swarm</option>
                <option value="NEURAL_CONGESTION_AVOIDANCE">Neural Congestion Avoidance</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Registering Vehicle...' : 'Add Transit Vehicle →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🚇</span> Active Transit Fleet ({vehicles.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Vehicle ID & Route</th>
                  <th className="p-4 font-medium">Velocity & Occupancy</th>
                  <th className="p-4 font-medium">Suspension Stability</th>
                  <th className="p-4 font-medium text-right">AI Routing Mode</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{v.vehicleId}</p>
                      <p className="text-[10px] text-slate-400">{v.routeIdentifier}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-cyan-400 font-semibold">{v.podVelocityKph} km/h</p>
                      <p className="text-[10px] text-slate-400">{v.passengerOccupancy} Passengers</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {v.magneticSuspensionStabilityPct}%
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        v.aiTrafficRoutingMode === 'DYNAMIC_PREDICTIVE_FLOW_OPTIMIZATION'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : v.aiTrafficRoutingMode === 'AUTONOMOUS_SWARM_INTELLIGENCE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/35'
                      }`}>
                        {v.aiTrafficRoutingMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {vehicles.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No transit vehicles registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
