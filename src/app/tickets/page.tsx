'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HelpdeskPage() {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('HVAC Maintenance');
  const [priority, setPriority] = useState('HIGH');
  const [submittedBy, setSubmittedBy] = useState('Campus Facilities Lead');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [tickets, setTickets] = useState([
    { id: '1', subject: 'Chiller Unit 2 refrigerant pressure fluctuation', category: 'HVAC', priority: 'HIGH', status: 'IN_PROGRESS', submittedBy: 'IoT Sensor Gateway', createdAt: new Date().toISOString() },
    { id: '2', subject: 'Lecture Hall B smart projector lamp replacement', category: 'IT Hardware', priority: 'MEDIUM', status: 'OPEN', submittedBy: 'Prof. Anderson', createdAt: new Date(Date.now() - 43200000).toISOString() },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, category, priority, submittedBy }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create ticket');

      setTickets([data, ...tickets]);
      setSubject('');
      setSuccess('Maintenance ticket successfully submitted and queued for dispatch.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/35">
                ITSM & MAINTENANCE DESK
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Helpdesk & Incident Tickets</h1>
            <p className="text-xs text-slate-400">Manage facility maintenance requests, equipment repairs, and IT support workflows.</p>
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

        <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛠️</span> Submit New Maintenance Ticket
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-medium text-slate-400">Issue Subject / Description</label>
              <input 
                type="text" 
                placeholder="e.g. Science Wing Air Handler compressor noise" 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="HVAC Maintenance">HVAC & Climate</option>
                <option value="Solar Inverter">Solar & Electrical</option>
                <option value="IT Hardware">IT Hardware</option>
                <option value="Campus Facilities">General Facilities</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Priority Level</label>
              <select 
                value={priority} 
                onChange={e => setPriority(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="CRITICAL">Critical Emergency</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Submitted By</label>
              <input 
                type="text" 
                value={submittedBy} 
                onChange={e => setSubmittedBy(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button 
              type="submit" 
              disabled={loading} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {loading ? 'Submitting...' : 'Submit Work Order Ticket →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📋</span> Active Maintenance Work Orders
          </h3>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      t.priority === 'HIGH' || t.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {t.priority}
                    </span>
                    <span className="text-slate-400 text-xs font-mono">[{t.category}]</span>
                    <h4 className="font-semibold text-white text-xs">{t.subject}</h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    Submitted by {t.submittedBy} on {new Date(t.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    t.status === 'OPEN' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {t.status}
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
