'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CrisisPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [incidentType, setIncidentType] = useState('SECURITY');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState('HIGH');
  const [assignedTeam, setAssignedTeam] = useState('Campus Security Alpha');
  const [dispatching, setDispatching] = useState(false);

  useEffect(() => {
    fetch('/api/crisis')
      .then(res => res.json())
      .then(data => {
        setIncidents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setDispatching(true);

    try {
      const res = await fetch('/api/crisis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, incidentType, location, severity, assignedTeam }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch emergency');

      setIncidents([data, ...incidents]);
      setTitle('');
      setLocation('');
      alert('Emergency incident dispatched successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/35 animate-pulse">
                CRISIS COMMAND & EMERGENCY RESPONSE
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Emergency Response Center</h1>
            <p className="text-xs text-slate-400">Coordinate emergency teams, manage active campus crises, and dispatch real-time security alerts.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleDispatch} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🚨</span> Dispatch Emergency Incident
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Incident Title / Description</label>
              <input 
                type="text" 
                placeholder="e.g. Fire Alarm Triggered in Dormitory 3" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Exact Location</label>
              <input 
                type="text" 
                placeholder="e.g. West Campus Quad" 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Incident Type</label>
              <select 
                value={incidentType} 
                onChange={e => setIncidentType(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="SECURITY">Security Threat</option>
                <option value="MEDICAL">Medical Emergency</option>
                <option value="HAZMAT">Hazardous Materials</option>
                <option value="FIRE">Fire & Evacuation</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Severity Level</label>
              <select 
                value={severity} 
                onChange={e => setSeverity(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Assigned Response Team</label>
              <input 
                type="text" 
                value={assignedTeam} 
                onChange={e => setAssignedTeam(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={dispatching} 
              className="px-6 py-3 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-all disabled:opacity-50 shadow-lg shadow-rose-600/20"
            >
              {dispatching ? 'Broadcasting Alert...' : 'Dispatch Emergency Unit ⚡'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Active Incidents & Response Registry ({incidents.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Incident</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Assigned Team</th>
                  <th className="p-4 font-medium">Severity</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr key={inc.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{inc.title}</p>
                      <p className="text-[10px] text-slate-500">Type: {inc.incidentType}</p>
                    </td>
                    <td className="p-4 text-slate-300">{inc.location}</td>
                    <td className="p-4 text-cyan-400">{inc.assignedTeam}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        inc.severity === 'CRITICAL' || inc.severity === 'HIGH'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        inc.status === 'RESOLVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : inc.status === 'RESPONDING'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/35 animate-pulse'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {incidents.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No active crisis incidents recorded.
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
