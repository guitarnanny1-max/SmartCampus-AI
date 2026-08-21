export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DroneSecurityPage() {
  const [drones, setDrones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [droneCode, setDroneCode] = useState('');
  const [sectorName, setSectorName] = useState('');
  const [batteryPct, setBatteryPct] = useState('90');
  const [patrolStatus, setPatrolStatus] = useState('PATROLLING');
  const [aiIntrusions, setAiIntrusions] = useState('0');
  const [currentAltitudeM, setCurrentAltitudeM] = useState('45');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/drone-security')
      .then(res => res.json())
      .then(data => {
        setDrones(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddDrone = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/drone-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ droneCode, sectorName, batteryPct, patrolStatus, aiIntrusions, currentAltitudeM }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to deploy drone');

      setDrones([data, ...drones]);
      setDroneCode('');
      setSectorName('');
      alert('Autonomous security drone deployed successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/35">
                AUTONOMOUS DRONE SECURITY
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Drone Perimeter Surveillance Command</h1>
            <p className="text-xs text-slate-400">Monitor aerial drone patrols, battery levels, altitude telemetry, and AI intrusion detection.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddDrone} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛸</span> Deploy Security Drone Unit
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Drone Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. DRONE-DELTA-04" 
                value={droneCode} 
                onChange={e => setDroneCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Patrol Sector Name</label>
              <input 
                type="text" 
                placeholder="e.g. South Boundary & Gate 2" 
                value={sectorName} 
                onChange={e => setSectorName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Battery Level (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={batteryPct} 
                onChange={e => setBatteryPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Patrol Status</label>
              <select 
                value={patrolStatus} 
                onChange={e => setPatrolStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="PATROLLING">Patrolling</option>
                <option value="STATIONARY_GUARD">Stationary Guard</option>
                <option value="RETURNING_TO_DOCK">Returning to Dock</option>
                <option value="CHARGING">Charging</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Altitude (Meters)</label>
              <input 
                type="number" 
                value={currentAltitudeM} 
                onChange={e => setCurrentAltitudeM(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Intrusions Flagged</label>
              <input 
                type="number" 
                min="0" 
                value={aiIntrusions} 
                onChange={e => setAiIntrusions(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-indigo-500 text-slate-950 font-bold text-xs hover:bg-indigo-400 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
              {adding ? 'Deploying Drone...' : 'Launch Drone Patrol →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Active Aerial Security Fleet ({drones.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Drone & Sector</th>
                  <th className="p-4 font-medium">Battery & Altitude</th>
                  <th className="p-4 font-medium">AI Intrusions</th>
                  <th className="p-4 font-medium text-right">Patrol Status</th>
                </tr>
              </thead>
              <tbody>
                {drones.map((d: any) => (
                  <tr key={d.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{d.droneCode}</p>
                      <p className="text-[10px] text-slate-400">{d.sectorName}</p>
                    </td>
                    <td className="p-4 font-mono text-slate-300">
                      {d.batteryPct}% Battery | {d.currentAltitudeM}m Alt
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.aiIntrusions > 0 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/35' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/35'
                      }`}>
                        {d.aiIntrusions} Detected
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        d.patrolStatus === 'PATROLLING'
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/35 animate-pulse'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {d.patrolStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {drones.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No security drones deployed.
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
