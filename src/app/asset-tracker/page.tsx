'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AssetTrackerPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assetCode, setAssetCode] = useState('');
  const [assetName, setAssetName] = useState('');
  const [category, setCategory] = useState('SCIENTIFIC_EQUIPMENT');
  const [buildingName, setBuildingName] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [batteryPct, setBatteryPct] = useState('95');
  const [status, setStatus] = useState('SECURE_IN_ZONE');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/asset-tracker')
      .then(res => res.json())
      .then(data => {
        setAssets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/asset-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetCode, assetName, category, buildingName, currentRoom, batteryPct, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register asset tracker');

      setAssets([data, ...assets]);
      setAssetCode('');
      setAssetName('');
      setBuildingName('');
      setCurrentRoom('');
      alert('Asset registered successfully.');
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
                ASSET GEOFENCE TRACKING HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Smart Asset & Equipment Geofencing</h1>
            <p className="text-xs text-slate-400">Monitor high-value lab hardware, multimedia gear, and medical instruments via IoT BLE beacons.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddAsset} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📍</span> Register IoT Asset Beacon
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Asset Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. AST-ROBOT-09" 
                value={assetCode} 
                onChange={e => setAssetCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Asset Name</label>
              <input 
                type="text" 
                placeholder="e.g. Autonomous AI Research Arm" 
                value={assetName} 
                onChange={e => setAssetName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="SCIENTIFIC_EQUIPMENT">Scientific Equipment</option>
                <option value="MULTIMEDIA_GEAR">Multimedia & Broadcast</option>
                <option value="MEDICAL_HARDWARE">Medical Hardware</option>
                <option value="IT_SERVER_UNIT">IT & Server Hardware</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Building Name</label>
              <input 
                type="text" 
                placeholder="e.g. Robotics Center" 
                value={buildingName} 
                onChange={e => setBuildingName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Current Room / Location</label>
              <input 
                type="text" 
                placeholder="e.g. Lab 102" 
                value={currentRoom} 
                onChange={e => setCurrentRoom(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Beacon Battery (%)</label>
              <input 
                type="number" 
                value={batteryPct} 
                onChange={e => setBatteryPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              {adding ? 'Registering Asset...' : 'Track Asset Beacon →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Live Campus Asset Inventory ({assets.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Asset ID & Name</th>
                  <th className="p-4 font-medium">Building & Room</th>
                  <th className="p-4 font-medium">Battery</th>
                  <th className="p-4 font-medium text-right">Geofence Status</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{a.assetCode}</p>
                      <p className="text-[10px] text-slate-400">{a.assetName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">{a.buildingName}</p>
                      <p className="text-[10px] text-cyan-400">{a.currentRoom}</p>
                    </td>
                    <td className="p-4 font-mono text-slate-300">
                      {a.batteryPct}%
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        a.status === 'SECURE_IN_ZONE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/35 animate-pulse'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {assets.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No tracked asset beacons registered.
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
