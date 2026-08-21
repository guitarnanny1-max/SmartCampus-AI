export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartLockersPage() {
  const [lockers, setLockers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lockerBank, setLockerBank] = useState('');
  const [lockerNumber, setLockerNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [carrierName, setCarrierName] = useState('CAMPUS_ROBOT');
  const [status, setStatus] = useState('STORED');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-lockers')
      .then(res => res.json())
      .then(data => {
        setLockers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddLocker = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-lockers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lockerBank, lockerNumber, recipientName, carrierName, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to assign locker parcel');

      setLockers([data, ...lockers]);
      setLockerBank('');
      setLockerNumber('');
      setRecipientName('');
      alert('Parcel assigned to smart locker successfully.');
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
                SMART LOCKER & MAILROOM HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Digital Parcel Lockers & Mailroom</h1>
            <p className="text-xs text-slate-400">Manage automated delivery robot drop-offs, secure PIN-based pickups, and residential mailbox inventories.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddLocker} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📦</span> Assign Parcel to Smart Locker
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Locker Bank Code</label>
              <input 
                type="text" 
                placeholder="e.g. BANK-DORM-C" 
                value={lockerBank} 
                onChange={e => setLockerBank(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Locker Number</label>
              <input 
                type="text" 
                placeholder="e.g. L-310" 
                value={lockerNumber} 
                onChange={e => setLockerNumber(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Recipient Name / Student</label>
              <input 
                type="text" 
                placeholder="e.g. Chloe Bennett" 
                value={recipientName} 
                onChange={e => setRecipientName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Delivery Carrier / Service</label>
              <input 
                type="text" 
                value={carrierName} 
                onChange={e => setCarrierName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Initial Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="STORED">Stored in Locker</option>
                <option value="COLLECTED">Collected</option>
                <option value="EXPIRED">Expired / Returned</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-violet-500 text-white font-bold text-xs hover:bg-violet-400 transition-all disabled:opacity-50 shadow-lg shadow-violet-500/20"
            >
              {adding ? 'Assigning Parcel...' : 'Store in Smart Locker →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Active Mailroom Lockers ({lockers.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Bank & Locker</th>
                  <th className="p-4 font-medium">Recipient & Carrier</th>
                  <th className="p-4 font-medium">Retrieval PIN</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {lockers.map((l: any) => (
                  <tr key={l.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{l.lockerBank}</p>
                      <p className="text-[10px] text-violet-400">Slot: {l.lockerNumber}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white">{l.recipientName}</p>
                      <p className="text-[10px] text-slate-400">{l.carrierName}</p>
                    </td>
                    <td className="p-4 font-mono text-cyan-400 font-bold">
                      🔑 {l.retrievalPin}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        l.status === 'STORED'
                          ? 'bg-violet-500/10 text-violet-400 border-violet-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {lockers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No parcels currently stored in lockers.
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
