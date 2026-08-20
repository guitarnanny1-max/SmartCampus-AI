'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EmergencyBroadcastPage() {
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('SMS & Push');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [broadcasts, setBroadcasts] = useState([
    { id: '1', title: ' Severe Weather Advisory: Early Campus Closure at 3:00 PM', channel: 'SMS & Email', recipientCount: 1850, createdAt: new Date().toISOString() },
    { id: '2', title: ' Scheduled Fire Drill Inspection in Academic Block A', channel: 'Push Notification', recipientCount: 920, createdAt: new Date(Date.now() - 86400000).toISOString() },
  ]);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, channel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch broadcast');

      setBroadcasts([data, ...broadcasts]);
      setTitle('');
      setSuccess('Emergency broadcast successfully dispatched to all registered institutional contacts.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/35 animate-pulse">
                CRITICAL EMERGENCY SYSTEM
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Mass Broadcast Center</h1>
            <p className="text-xs text-slate-400">Instantly dispatch emergency warnings, security alerts, and weather advisories to all students and staff.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
            <span>✓</span> {success}
          </div>
        )}

        <form onSubmit={handleDispatch} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🚨</span> New Emergency Broadcast Dispatch
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-medium text-slate-400">Emergency Alert Message</label>
              <input 
                type="text" 
                placeholder="e.g. Weather Warning: Immediate Evacuation of Sports Complex" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Dispatch Channel</label>
              <select 
                value={channel} 
                onChange={e => setChannel(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="SMS & Push">SMS & Mobile Push</option>
                <option value="Email Broadcast">Institutional Email</option>
                <option value="All Channels">All Channels (SMS + Email + Push)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button 
              type="submit" 
              disabled={loading} 
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all disabled:opacity-50 shadow-lg shadow-rose-600/20"
            >
              {loading ? 'Broadcasting...' : '⚠️ Broadcast Emergency Alert Now'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📋</span> Broadcast History & Delivery Logs
          </h3>

          <div className="space-y-3">
            {broadcasts.map((item) => (
              <div key={item.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono">
                      {item.channel}
                    </span>
                    <h4 className="font-semibold text-white text-xs">{item.title}</h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    Dispatched on {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30">
                    {item.recipientCount} Recipients
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
                    Delivered
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
