export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartLightingPage() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unitCode, setUnitCode] = useState('');
  const [zoneName, setZoneName] = useState('');
  const [brightnessPct, setBrightnessPct] = useState('80');
  const [motionSensing, setMotionSensing] = useState(true);
  const [powerDrawWatts, setPowerDrawWatts] = useState('45.0');
  const [status, setStatus] = useState('ACTIVE');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-lighting')
      .then(res => res.json())
      .then(data => {
        setFixtures(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddFixture = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-lighting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitCode, zoneName, brightnessPct, motionSensing, powerDrawWatts, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register lighting fixture');

      setFixtures([data, ...fixtures]);
      setUnitCode('');
      setZoneName('');
      alert('Smart lighting fixture registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/35">
                SMART LIGHTING & PHOTOMETRIC HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Smart LED Illumination Command</h1>
            <p className="text-xs text-slate-400">Monitor intelligent outdoor lighting arrays, motion sensors, and real-time wattage consumption.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddFixture} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>💡</span> Register Smart Lighting Fixture
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Fixture Unit Code</label>
              <input 
                type="text" 
                placeholder="e.g. LIGHT-LIB-04" 
                value={unitCode} 
                onChange={e => setUnitCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Campus Zone Name</label>
              <input 
                type="text" 
                placeholder="e.g. Library Plaza Walkway" 
                value={zoneName} 
                onChange={e => setZoneName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Brightness (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={brightnessPct} 
                onChange={e => setBrightnessPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Power Draw (Watts)</label>
              <input 
                type="number" 
                step="0.1" 
                value={powerDrawWatts} 
                onChange={e => setPowerDrawWatts(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Motion Sensor Active</label>
              <select 
                value={motionSensing ? 'true' : 'false'} 
                onChange={e => setMotionSensing(e.target.value === 'true')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              {adding ? 'Registering Fixture...' : 'Add Lighting Fixture →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>✨</span> Campus Smart Lighting Network ({fixtures.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Fixture & Zone</th>
                  <th className="p-4 font-medium">Brightness</th>
                  <th className="p-4 font-medium">Power Draw</th>
                  <th className="p-4 font-medium text-right">Motion / Status</th>
                </tr>
              </thead>
              <tbody>
                {fixtures.map((f: any) => (
                  <tr key={f.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{f.unitCode}</p>
                      <p className="text-[10px] text-slate-400">{f.zoneName}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full" style={{ width: `${f.brightnessPct}%` }} />
                        </div>
                        <span className="font-mono text-white text-[11px]">{f.brightnessPct}%</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-amber-400 font-bold">
                      {f.powerDrawWatts} W
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {f.motionSensing && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                            RADAR
                          </span>
                        )}
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/35">
                          {f.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {fixtures.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No smart lighting fixtures registered.
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
