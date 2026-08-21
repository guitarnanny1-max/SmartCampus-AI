export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TurnstileAccessPage() {
  const [accesses, setAccesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gateCode, setGateCode] = useState('');
  const [locationName, setLocationName] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [hostName, setHostName] = useState('');
  const [accessMethod, setAccessMethod] = useState('QR_BADGE');
  const [status, setStatus] = useState('GRANTED');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/turnstile-access')
      .then(res => res.json())
      .then(data => {
        setAccesses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/turnstile-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gateCode, locationName, visitorName, hostName, accessMethod, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record turnstile entry');

      setAccesses([data, ...accesses]);
      setGateCode('');
      setVisitorName('');
      setHostName('');
      alert('Turnstile access logged successfully.');
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
                VISITOR ACCESS & TURNSTILE HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Smart Gate & Turnstile Command</h1>
            <p className="text-xs text-slate-400">Monitor biometric entry validation, visitor badge check-ins, and real-time gate clearance logs.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddAccess} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🚪</span> Log Gate Entry or Visitor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Gate / Turnstile Code</label>
              <input 
                type="text" 
                placeholder="e.g. GATE-WEST-03" 
                value={gateCode} 
                onChange={e => setGateCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Location / Checkpoint Name</label>
              <input 
                type="text" 
                placeholder="e.g. West Sports Complex Entrance" 
                value={locationName} 
                onChange={e => setLocationName(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Visitor / Person Name</label>
              <input 
                type="text" 
                placeholder="e.g. Michael Scott" 
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
                placeholder="e.g. Director of Admissions" 
                value={hostName} 
                onChange={e => setHostName(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Access Method</label>
              <select 
                value={accessMethod} 
                onChange={e => setAccessMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="QR_BADGE">QR Digital Badge</option>
                <option value="FACIAL_BIOMETRIC">Facial Biometric</option>
                <option value="RFID_CARD">RFID Student Card</option>
                <option value="MANUAL_OVERRIDE">Manual Security Override</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Logging Entry...' : 'Record Turnstile Entry →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Live Turnstile & Visitor Logs ({accesses.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Gate & Checkpoint</th>
                  <th className="p-4 font-medium">Visitor & Host</th>
                  <th className="p-4 font-medium">Access Method</th>
                  <th className="p-4 font-medium text-right">Clearance Status</th>
                </tr>
              </thead>
              <tbody>
                {accesses.map((a: any) => (
                  <tr key={a.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{a.gateCode}</p>
                      <p className="text-[10px] text-slate-400">{a.locationName}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white">{a.visitorName}</p>
                      <p className="text-[10px] text-slate-400">Host: {a.hostName}</p>
                    </td>
                    <td className="p-4 font-mono text-cyan-400">
                      {a.accessMethod}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        a.status === 'GRANTED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {accesses.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No turnstile access logs recorded.
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
