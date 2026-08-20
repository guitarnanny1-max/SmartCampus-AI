'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState('');
  const [clubName, setClubName] = useState('');
  const [venue, setVenue] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [budget, setBudget] = useState('2500');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, clubName, venue, eventDate, budget }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');

      setEvents([data, ...events]);
      setEventName('');
      setClubName('');
      setVenue('');
      setEventDate('');
      setBudget('2500');
      alert('Campus event successfully registered and approved.');
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
                CAMPUS LIFE & CULTURE
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Event & Club Management Portal</h1>
            <p className="text-xs text-slate-400">Organize cultural fests, manage student club activities, allocate festival budgets, and schedule venues.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddEvent} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎉</span> Register New Event or Festival
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Event Title</label>
              <input 
                type="text" 
                placeholder="e.g. AI & Robotics Symposium" 
                value={eventName} 
                onChange={e => setEventName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Organizing Club / Society</label>
              <input 
                type="text" 
                placeholder="e.g. Artificial Intelligence Club" 
                value={clubName} 
                onChange={e => setClubName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Campus Venue</label>
              <input 
                type="text" 
                placeholder="e.g. Lecture Hall 3" 
                value={venue} 
                onChange={e => setVenue(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Event Date</label>
              <input 
                type="date" 
                value={eventDate} 
                onChange={e => setEventDate(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Allocated Budget ($)</label>
              <input 
                type="number" 
                step="0.01" 
                value={budget} 
                onChange={e => setBudget(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Registering Event...' : 'Schedule Event →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📅</span> Campus Events Directory ({events.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Event Name</th>
                  <th className="p-4 font-medium">Club / Society</th>
                  <th className="p-4 font-medium">Venue & Date</th>
                  <th className="p-4 font-medium">Budget</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{e.eventName}</td>
                    <td className="p-4 text-cyan-400">{e.clubName}</td>
                    <td className="p-4 text-slate-300">
                      <div>{e.venue}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{e.eventDate}</div>
                    </td>
                    <td className="p-4 font-mono text-emerald-400">${e.budget.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        e.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No campus events found.
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
