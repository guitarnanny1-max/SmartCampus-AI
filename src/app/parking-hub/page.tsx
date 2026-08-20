'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ParkingHubPage() {
  const [bays, setBays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bayNo, setBayNo] = useState('');
  const [zoneName, setZoneName] = useState('');
  const [isEvCharging, setIsEvCharging] = useState(false);
  const [status, setStatus] = useState('AVAILABLE');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/parking-hub')
      .then(res => res.json())
      .then(data => {
        setBays(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddBay = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/parking-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bayNo, zoneName, isEvCharging, status, vehicleNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add parking bay');

      setBays([data, ...bays]);
      setBayNo('');
      setZoneName('');
      setVehicleNumber('');
      alert('Smart parking bay registered successfully.');
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
                SMART PARKING & EV CHARGING
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Parking Bay & EV Hub</h1>
            <p className="text-xs text-slate-400">Monitor live parking slot occupancy, electric vehicle charging stations, and gate access.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddBay} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🅿️</span> Register Parking Bay / EV Station
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Bay / Slot Number</label>
              <input 
                type="text" 
                placeholder="e.g. EV-03 or PK-201" 
                value={bayNo} 
                onChange={e => setBayNo(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Campus Zone Name</label>
              <input 
                type="text" 
                placeholder="e.g. Student Center Underground Lot" 
                value={zoneName} 
                onChange={e => setZoneName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Slot Type</label>
              <select 
                value={isEvCharging ? 'true' : 'false'} 
                onChange={e => setIsEvCharging(e.target.value === 'true')} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="false">Standard Parking Bay</option>
                <option value="true">EV Charging Station</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="RESERVED">Reserved</option>
                <option value="MAINTENANCE">Under Maintenance</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Vehicle Number (if occupied)</label>
              <input 
                type="text" 
                placeholder="e.g. KA-05-AB-1234" 
                value={vehicleNumber} 
                onChange={e => setVehicleNumber(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
            >
              {adding ? 'Registering Bay...' : 'Add Parking Bay →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🚗</span> Campus Parking & EV Network ({bays.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Bay & Type</th>
                  <th className="p-4 font-medium">Zone Name</th>
                  <th className="p-4 font-medium">Vehicle No</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {bays.map((bay) => (
                  <tr key={bay.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{bay.bayNo}</p>
                      <p className="text-[10px] text-indigo-400">
                        {bay.isEvCharging ? '⚡ EV Charging Station' : 'Standard Parking'}
                      </p>
                    </td>
                    <td className="p-4 text-slate-300">{bay.zoneName}</td>
                    <td className="p-4 font-mono text-slate-300">{bay.vehicleNumber || '—'}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        bay.status === 'AVAILABLE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : bay.status === 'OCCUPIED'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {bay.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {bays.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No parking bays registered.
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
