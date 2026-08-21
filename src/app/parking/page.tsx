export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ParkingPage() {
  const [permits, setPermits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [permitType, setPermitType] = useState('STUDENT');
  const [slotNo, setSlotNo] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/parking')
      .then(res => res.json())
      .then(data => {
        setPermits(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddPermit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/parking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerName, vehicleNo, permitType, slotNo, status: 'ACTIVE' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to issue permit');

      setPermits([data, ...permits]);
      setOwnerName('');
      setVehicleNo('');
      setSlotNo('');
      alert('Parking decal and permit successfully issued.');
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
                CAMPUS SECURITY & FACILITIES
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Parking & Vehicle Decal Portal</h1>
            <p className="text-xs text-slate-400">Manage vehicle registrations, parking permit decals, slot assignments, and lot access control.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddPermit} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🚗</span> Issue New Parking Decal & Slot
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Vehicle Owner Name</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Sarah Jenkins" 
                value={ownerName} 
                onChange={e => setOwnerName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Vehicle License Plate No</label>
              <input 
                type="text" 
                placeholder="e.g. CA-552-LKM" 
                value={vehicleNo} 
                onChange={e => setVehicleNo(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-cyan-400 focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Permit Classification</label>
              <select 
                value={permitType} 
                onChange={e => setPermitType(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="STUDENT">STUDENT PERMIT</option>
                <option value="FACULTY">FACULTY & STAFF</option>
                <option value="VIP">VIP / GUEST</option>
                <option value="EV_CHARGING">EV CHARGING LOT</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Allocated Slot Number</label>
              <input 
                type="text" 
                placeholder="e.g. Lot B - 214" 
                value={slotNo} 
                onChange={e => setSlotNo(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Issuing Permit...' : 'Issue Parking Decal →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🅿️</span> Active Parking Permits ({permits.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Owner</th>
                  <th className="p-4 font-medium">License Plate</th>
                  <th className="p-4 font-medium">Permit Type</th>
                  <th className="p-4 font-medium">Assigned Slot</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {permits.map((p: any) => (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{p.ownerName}</td>
                    <td className="p-4 font-mono text-cyan-400">{p.vehicleNo}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {p.permitType}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{p.slotNo}</td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {permits.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No parking permits registered.
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
