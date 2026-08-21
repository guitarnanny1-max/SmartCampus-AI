export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartPoolPage() {
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [poolCode, setPoolCode] = useState('');
  const [poolName, setPoolName] = useState('');
  const [waterTempC, setWaterTempC] = useState('27.5');
  const [phLevel, setPhLevel] = useState('7.4');
  const [chlorinePpm, setChlorinePpm] = useState('2.0');
  const [swimmerCount, setSwimmerCount] = useState('0');
  const [aiSafetyStatus, setAiSafetyStatus] = useState('SECURE_MONITORING');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-pool')
      .then(res => res.json())
      .then(data => {
        setPools(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddPool = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-pool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poolCode, poolName, waterTempC, phLevel, chlorinePpm, swimmerCount, aiSafetyStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register pool');

      setPools([data, ...pools]);
      setPoolCode('');
      setPoolName('');
      alert('Smart pool registered successfully.');
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
                SMART AQUATICS & POOL SAFETY HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Swimming Pool Telemetry</h1>
            <p className="text-xs text-slate-400">Monitor water temperature, chemical balance, swimmer count, and AI drowning detection feeds in real time.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddPool} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏊‍♂️</span> Register Pool Sensor & Safety Hub
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Pool Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. POOL-KID-04" 
                value={poolCode} 
                onChange={e => setPoolCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Pool Name</label>
              <input 
                type="text" 
                placeholder="e.g. Campus Learners Pool" 
                value={poolName} 
                onChange={e => setPoolName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Water Temp (°C)</label>
              <input 
                type="number" 
                step="0.1" 
                value={waterTempC} 
                onChange={e => setWaterTempC(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">pH Level</label>
              <input 
                type="number" 
                step="0.1" 
                value={phLevel} 
                onChange={e => setPhLevel(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Chlorine (PPM)</label>
              <input 
                type="number" 
                step="0.1" 
                value={chlorinePpm} 
                onChange={e => setChlorinePpm(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Swimmers Count</label>
              <input 
                type="number" 
                value={swimmerCount} 
                onChange={e => setSwimmerCount(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Safety Status</label>
              <select 
                value={aiSafetyStatus} 
                onChange={e => setAiSafetyStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="SECURE_MONITORING">Secure Monitoring</option>
                <option value="LIFEGUARD_ALERT">Lifeguard Alert</option>
                <option value="MAINTENANCE_CLOSED">Closed for Maintenance</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Registering Pool...' : 'Add Smart Pool →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Active Aquatics & Pool Telemetry ({pools.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Pool Code & Name</th>
                  <th className="p-4 font-medium">Water Temp & pH</th>
                  <th className="p-4 font-medium">Chlorine & Swimmers</th>
                  <th className="p-4 font-medium text-right">AI Safety Status</th>
                </tr>
              </thead>
              <tbody>
                {pools.map((p: any) => (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{p.poolCode}</p>
                      <p className="text-[10px] text-slate-400">{p.poolName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-cyan-400 font-semibold">{p.waterTempC}°C</p>
                      <p className="text-[10px] text-slate-400">pH: {p.phLevel}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-slate-300">Cl: {p.chlorinePpm} ppm</p>
                      <p className="text-[10px] text-emerald-400 font-semibold">{p.swimmerCount} Swimmers active</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        p.aiSafetyStatus === 'SECURE_MONITORING'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : p.aiSafetyStatus === 'LIFEGUARD_ALERT'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {p.aiSafetyStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {pools.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No smart pools registered.
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
