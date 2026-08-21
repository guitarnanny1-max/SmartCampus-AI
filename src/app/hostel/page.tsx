export const revalidate = 0;
export const dynamic = 'force-dynamic';
'default client';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HostelPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomNo, setRoomNo] = useState('');
  const [blockName, setBlockName] = useState('Newton Hall (Boys)');
  const [capacity, setCapacity] = useState('2');
  const [occupancy, setOccupancy] = useState('0');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/hostel')
      .then(res => res.json())
      .then(data => {
        setRooms(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/hostel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomNo, blockName, capacity, occupancy }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add room');

      setRooms([data, ...rooms]);
      setRoomNo('');
      setCapacity('2');
      setOccupancy('0');
      alert('Hostel room successfully configured.');
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
                RESIDENTIAL LIFE & HOUSING
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Hostel & Room Allotment</h1>
            <p className="text-xs text-slate-400">Manage student residential blocks, bed capacities, and real-time room occupancies.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddRoom} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏠</span> Add New Hostel Room / Dorm
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Room Number</label>
              <input 
                type="text" 
                placeholder="e.g. D-402" 
                value={roomNo} 
                onChange={e => setRoomNo(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Hostel Block Name</label>
              <input 
                type="text" 
                placeholder="e.g. Einstein Hall" 
                value={blockName} 
                onChange={e => setBlockName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Total Bed Capacity</label>
              <input 
                type="number" 
                value={capacity} 
                onChange={e => setCapacity(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Current Occupancy</label>
              <input 
                type="number" 
                value={occupancy} 
                onChange={e => setOccupancy(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Configuring Room...' : 'Allocate Room →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏢</span> Residence Hall Directory ({rooms.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Room No</th>
                  <th className="p-4 font-medium">Block</th>
                  <th className="p-4 font-medium">Capacity</th>
                  <th className="p-4 font-medium">Occupancy</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r: any) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-cyan-400">{r.roomNo}</td>
                    <td className="p-4 text-white font-semibold">{r.blockName}</td>
                    <td className="p-4 font-mono text-slate-300">{r.capacity} Beds</td>
                    <td className="p-4 font-mono text-slate-300">{r.occupancy} Occupied</td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        r.status === 'AVAILABLE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {rooms.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No hostel rooms configured.
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
