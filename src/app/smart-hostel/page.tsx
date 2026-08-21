export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartHostelPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomNumber, setRoomNumber] = useState('');
  const [hostelBlock, setHostelBlock] = useState('Block A - Aryabhata');
  const [studentName, setStudentName] = useState('');
  const [roomType, setRoomType] = useState('Double Sharing');
  const [messFeeInr, setMessFeeInr] = useState('45000');
  const [occupancyStatus, setOccupancyStatus] = useState('OCCUPIED');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-hostel')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-hostel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomNumber, hostelBlock, studentName, roomType, messFeeInr, occupancyStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record hostel assignment');

      setRecords([data, ...records]);
      setRoomNumber('');
      setStudentName('');
      alert('Hostel assignment recorded successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/35">
                SMARTCAMPUS AI HOSTEL & ACCOMMODATION HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Hostel & Dormitory Management</h1>
            <p className="text-xs text-slate-400">Manage residential blocks, student room allocations, mess fee structures, and occupancy ledgers in Indian Rupees (₹).</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleAddRecord} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏠</span> Allocate Hostel Room & Mess Package
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Room Number</label>
              <input 
                type="text" 
                placeholder="e.g. 402-B" 
                value={roomNumber} 
                onChange={e => setRoomNumber(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Student Resident Name</label>
              <input 
                type="text" 
                placeholder="e.g. Rohan Gupta" 
                value={studentName} 
                onChange={e => setStudentName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Hostel Block</label>
              <input 
                type="text" 
                value={hostelBlock} 
                onChange={e => setHostelBlock(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Room Type</label>
              <select 
                value={roomType} 
                onChange={e => setRoomType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="Single Room">Single Room</option>
                <option value="Double Sharing">Double Sharing</option>
                <option value="Triple Sharing">Triple Sharing</option>
                <option value="Dormitory">Dormitory</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Annual Hostel & Mess Fee (₹)</label>
              <input 
                type="number" 
                value={messFeeInr} 
                onChange={e => setMessFeeInr(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-violet-500 text-slate-950 font-bold text-xs hover:bg-violet-400 transition-all disabled:opacity-50 shadow-lg shadow-violet-500/20"
            >
              {adding ? 'Allocating Room...' : 'Allocate Hostel Room →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏨</span> Hostel Resident Directory ({records.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Room & Block</th>
                  <th className="p-4 font-medium">Resident & Mess Fee</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r: any) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">Room {r.roomNumber}</p>
                      <p className="text-[10px] text-slate-400">{r.hostelBlock}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-violet-400 font-semibold">₹ {r.messFeeInr.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">({r.roomType})</span></p>
                      <p className="text-[10px] text-slate-400">Resident: {r.studentName}</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        r.occupancyStatus === 'OCCUPIED'
                          ? 'bg-violet-500/10 text-violet-400 border-violet-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {r.occupancyStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No hostel records found.
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
