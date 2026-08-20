'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartDronePage() {
  const [hubs, setHubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hubCode, setHubCode] = useState('');
  const [hubName, setHubName] = useState('');
  const [activeFleetCount, setActiveFleetCount] = useState('45');
  const [vtolLandingPads, setVtolLandingPads] = useState('8');
  const [avoidanceLatencyMs, setAvoidanceLatencyMs] = useState('1.2');
  const [aiSwarmMode, setAiSwarmMode] = useState('DEEP_REINFORCEMENT_LEARNING_SWARM_ROUTING');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-drone')
      .then(res => res.json())
      .then(data => {
        setHubs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddHub = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-drone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hubCode, hubName, activeFleetCount, vtolLandingPads, avoidanceLatencyMs, aiSwarmMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register hub');

      setHubs([data, ...hubs]);
      setHubCode('');
      setHubName('');
      alert('AAM drone hub registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/35">
                SMART AUTONOMOUS DRONE & AAM HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Aerial Mobility & Drone Grid</h1>
            <p className="text-xs text-slate-400">Monitor active drone fleet counts, VTOL pad occupancy, collision avoidance latency, and AI swarm routing.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddHub} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛸</span> Register Aerial Mobility Hub
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Hub Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. DRONE-HUB-04" 
                value={hubCode} 
                onChange={e => setHubCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Hub Name</label>
              <input 
                type="text" 
                placeholder="e.g. West Campus Skyport Terminal" 
                value={hubName} 
                onChange={e => setHubName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Active Fleet Count</label>
              <input 
                type="number" 
                value={activeFleetCount} 
                onChange={e => setActiveFleetCount(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">VTOL Pads</label>
              <input 
                type="number" 
                value={vtolLandingPads} 
                onChange={e => setVtolLandingPads(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Latency (ms)</label>
              <input 
                type="number" 
                step="0.1" 
                value={avoidanceLatencyMs} 
                onChange={e => setAvoidanceLatencyMs(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Swarm Mode</label>
              <select 
                value={aiSwarmMode} 
                onChange={e => setAiSwarmMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
              >
                <option value="DEEP_REINFORCEMENT_LEARNING_SWARM_ROUTING">RL Swarm Routing</option>
                <option value="DYNAMIC_OBSTACLE_AVOIDANCE_VECTOR">Dynamic Obstacle Vector</option>
                <option value="ZERO_CARBON_AUTONOMOUS_CORRIDOR">Zero Carbon Corridor</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition-all disabled:opacity-50 shadow-lg shadow-sky-500/20"
            >
              {adding ? 'Registering Hub...' : 'Add Aerial Mobility Hub →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛸</span> Active Aerial Mobility Hubs ({hubs.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Hub Code & Name</th>
                  <th className="p-4 font-medium">Fleet & VTOL Pads</th>
                  <th className="p-4 font-medium">Avoidance Latency</th>
                  <th className="p-4 font-medium text-right">AI Swarm Mode</th>
                </tr>
              </thead>
              <tbody>
                {hubs.map((h) => (
                  <tr key={h.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{h.hubCode}</p>
                      <p className="text-[10px] text-slate-400">{h.hubName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sky-400 font-semibold">{h.activeFleetCount} Drones Active</p>
                      <p className="text-[10px] text-slate-400">{h.vtolLandingPads} VTOL Pads</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {h.avoidanceLatencyMs} ms Latency
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        h.aiSwarmMode === 'DEEP_REINFORCEMENT_LEARNING_SWARM_ROUTING'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/35'
                          : h.aiSwarmMode === 'DYNAMIC_OBSTACLE_AVOIDANCE_VECTOR'
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {h.aiSwarmMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {hubs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No aerial mobility hubs registered.
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
