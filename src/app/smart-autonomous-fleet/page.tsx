export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartAutonomousFleetPage() {
  const [fleets, setFleets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fleetCode, setFleetCode] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [payloadCapacityKg, setPayloadCapacityKg] = useState('12.0');
  const [batteryRangePct, setBatteryRangePct] = useState('90.0');
  const [navigationAccuracyPct, setNavigationAccuracyPct] = useState('99.5');
  const [aiFleetOptimization, setAiFleetOptimization] = useState('REAL_TIME_OBSTACLE_REROUTING');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-autonomous-fleet')
      .then(res => res.json())
      .then(data => {
        setFleets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-autonomous-fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fleetCode, vehicleName, payloadCapacityKg, batteryRangePct, navigationAccuracyPct, aiFleetOptimization }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register vehicle');

      setFleets([data, ...fleets]);
      setFleetCode('');
      setVehicleName('');
      alert('Autonomous vehicle registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/35">
                AUTONOMOUS DRONES & ROVERS HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Autonomous Fleet Management</h1>
            <p className="text-xs text-slate-400">Monitor payload capacities (kg), battery range (%), navigation accuracy, and AI routing optimization.</p>
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
            <span>🚁</span> Register Autonomous Vehicle
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Fleet Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. ROVER-FLEET-04" 
                value={fleetCode} 
                onChange={e => setFleetCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Vehicle Name</label>
              <input 
                type="text" 
                placeholder="e.g. Campus Catering Delivery Rover Beta" 
                value={vehicleName} 
                onChange={e => setVehicleName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Payload Capacity (Kg)</label>
              <input 
                type="number" 
                step="0.5" 
                value={payloadCapacityKg} 
                onChange={e => setPayloadCapacityKg(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Battery Range (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={batteryRangePct} 
                onChange={e => setBatteryRangePct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Navigation Accuracy (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={navigationAccuracyPct} 
                onChange={e => setNavigationAccuracyPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Fleet Optimization</label>
              <select 
                value={aiFleetOptimization} 
                onChange={e => setAiFleetOptimization(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="REAL_TIME_OBSTACLE_REROUTING">Real-Time Obstacle Rerouting</option>
                <option value="MULTI_STOP_CLUSTER_ROUTING">Multi-Stop Cluster Routing</option>
                <option value="PRIORITY_CORRIDOR_OVERRIDE">Priority Corridor Override</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-purple-500 text-slate-950 font-bold text-xs hover:bg-purple-400 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
            >
              {adding ? 'Registering Vehicle...' : 'Add Autonomous Vehicle →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🚀</span> Active Campus Fleet ({fleets.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Fleet Code & Vehicle</th>
                  <th className="p-4 font-medium">Payload & Battery Range</th>
                  <th className="p-4 font-medium">Nav. Accuracy</th>
                  <th className="p-4 font-medium text-right">AI Routing Mode</th>
                </tr>
              </thead>
              <tbody>
                {fleets.map((f: any) => (
                  <tr key={f.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{f.fleetCode}</p>
                      <p className="text-[10px] text-slate-400">{f.vehicleName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-purple-400 font-semibold">{f.payloadCapacityKg} Kg Payload</p>
                      <p className="text-[10px] text-slate-400">{f.batteryRangePct}% Battery Range</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {f.navigationAccuracyPct}% Accuracy
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        f.aiFleetOptimization === 'REAL_TIME_OBSTACLE_REROUTING'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/35'
                          : f.aiFleetOptimization === 'MULTI_STOP_CLUSTER_ROUTING'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {f.aiFleetOptimization}
                      </span>
                    </td>
                  </tr>
                ))}
                {fleets.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No autonomous vehicles registered.
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
