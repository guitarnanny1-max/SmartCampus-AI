export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartGymPage() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [equipmentCode, setEquipmentCode] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [category, setCategory] = useState('CARDIO');
  const [zoneName, setZoneName] = useState('');
  const [occupancyStatus, setOccupancyStatus] = useState('AVAILABLE');
  const [sensorBattery, setSensorBattery] = useState('95');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-gym')
      .then(res => res.json())
      .then(data => {
        setEquipment(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-gym', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipmentCode, equipmentName, category, zoneName, occupancyStatus, sensorBattery }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register gym equipment');

      setEquipment([data, ...equipment]);
      setEquipmentCode('');
      setEquipmentName('');
      setZoneName('');
      alert('Gym equipment registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/35">
                SMART GYM & FITNESS IOT HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Recreation & Fitness Center</h1>
            <p className="text-xs text-slate-400">Monitor athletic equipment utilization, biometric sensors, and recreation zone occupancy in real time.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddEquipment} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏋️</span> Register Fitness Equipment Sensor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Equipment Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. GYM-BIKE-30" 
                value={equipmentCode} 
                onChange={e => setEquipmentCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Equipment Name</label>
              <input 
                type="text" 
                placeholder="e.g. Smart Spinning Cycle Elite" 
                value={equipmentName} 
                onChange={e => setEquipmentName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none"
              >
                <option value="CARDIO">Cardio</option>
                <option value="STRENGTH">Strength Training</option>
                <option value="ROWING">Rowing & Ergometer</option>
                <option value="FUNCTIONAL">Functional & Yoga</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Recreation Zone</label>
              <input 
                type="text" 
                placeholder="e.g. Mezzanine Level" 
                value={zoneName} 
                onChange={e => setZoneName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Occupancy Status</label>
              <select 
                value={occupancyStatus} 
                onChange={e => setOccupancyStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none"
              >
                <option value="AVAILABLE">Available</option>
                <option value="IN_USE">In Use</option>
                <option value="MAINTENANCE">Under Maintenance</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Sensor Battery (%)</label>
              <input 
                type="number" 
                value={sensorBattery} 
                onChange={e => setSensorBattery(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-pink-500 text-white font-bold text-xs hover:bg-pink-400 transition-all disabled:opacity-50 shadow-lg shadow-pink-500/20"
            >
              {adding ? 'Registering Equipment...' : 'Add Gym Equipment →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Active Fitness Equipment Inventory ({equipment.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Equipment Code & Name</th>
                  <th className="p-4 font-medium">Zone & Category</th>
                  <th className="p-4 font-medium">Sensor Battery</th>
                  <th className="p-4 font-medium text-right">Occupancy Status</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((e: any) => (
                  <tr key={e.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{e.equipmentCode}</p>
                      <p className="text-[10px] text-slate-400">{e.equipmentName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">{e.zoneName}</p>
                      <p className="text-[10px] text-pink-400">{e.category}</p>
                    </td>
                    <td className="p-4 font-mono text-slate-300">
                      {e.sensorBattery}%
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        e.occupancyStatus === 'AVAILABLE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : e.occupancyStatus === 'IN_USE'
                          ? 'bg-pink-500/10 text-pink-400 border-pink-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {e.occupancyStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {equipment.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No gym equipment registered.
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
