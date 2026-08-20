'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VisitorManagementPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitorName, setVisitorName] = useState('');
  const [hostName, setHostName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [badgeNo, setBadgeNo] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    fetch('/api/visitors')
      .then(res => res.json())
      .then(data => {
        setVisitors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingIn(true);

    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorName, hostName, purpose, badgeNo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to check in visitor');

      setVisitors([data, ...visitors]);
      setVisitorName('');
      setHostName('');
      setPurpose('');
      setBadgeNo('');
      alert('Visitor successfully checked in and assigned smart RFID badge.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                CAMPUS SECURITY & ACCESS
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Visitor Management & RFID Gate Logs</h1>
            <p className="text-xs text-slate-400">Monitor external guests, issue digital RFID badges, and track security access across zones.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleCheckIn} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏷️</span> Check In New Visitor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Visitor Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Arthur Pendelton" 
                value={visitorName} 
                onChange={e => setVisitorName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Campus Host</label>
              <input 
                type="text" 
                placeholder="e.g. Prof. Sarah Jenkins" 
                value={hostName} 
                onChange={e => setHostName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Purpose of Visit</label>
              <input 
                type="text" 
                placeholder="e.g. Research Collaboration Meeting" 
                value={purpose} 
                onChange={e => setPurpose(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Assigned RFID Badge Number</label>
              <input 
                type="text" 
                placeholder="e.g. VIS-9025" 
                value={badgeNo} 
                onChange={e => setBadgeNo(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-cyan-400 focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={checkingIn} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {checkingIn ? 'Checking In...' : 'Issue Badge & Check In →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Active Visitor Access Logs ({visitors.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Visitor Name</th>
                  <th className="p-4 font-medium">Host</th>
                  <th className="p-4 font-medium">Purpose</th>
                  <th className="p-4 font-medium">Badge No</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v) => (
                  <tr key={v.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{v.visitorName}</td>
                    <td className="p-4 text-slate-300">{v.hostName}</td>
                    <td className="p-4 text-slate-400">{v.purpose}</td>
                    <td className="p-4 font-mono text-cyan-400">{v.badgeNo}</td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {visitors.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No active visitor logs.
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
