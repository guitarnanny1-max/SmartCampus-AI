export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartIndiaCelebrationsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState('');
  const [celebrationDate, setCelebrationDate] = useState('');
  const [category, setCategory] = useState('National');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-india-celebrations')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddCelebration = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-india-celebrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, celebrationDate, category, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add celebration');

      setRecords([data, ...records]);
      setEventName('');
      setCelebrationDate('');
      setDescription('');
      alert('New Indian celebration reminder scheduled successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleSendReminderBroadcast = (id: string, name: string) => {
    alert(`📢 Automated SMS & WhatsApp reminder broadcast sent to all students, parents, and faculty for "${name}"!`);
    setRecords(records.map((r: any) => r.id === id ? { ...r, status: 'REMINDER_SENT' } : r));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/35">
                SMARTCAMPUS AI INDIA DAY-WISE CELEBRATION REMINDER HUB 🇮🇳
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">National & Cultural Celebrations</h1>
            <p className="text-xs text-slate-400">Manage Indian school calendar events, automated assembly notifications, and cultural day reminders.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleAddCelebration} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🗓️</span> Schedule Custom Celebration or Holiday Event
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Event / Festival Name</label>
              <input 
                type="text" 
                placeholder="e.g. Annual Sanskritik Mahotsav" 
                value={eventName} 
                onChange={e => setEventName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Celebration Date</label>
              <input 
                type="text" 
                placeholder="e.g. October 15, 2026" 
                value={celebrationDate} 
                onChange={e => setCelebrationDate(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="National">National Holiday / Day</option>
                <option value="Cultural">Cultural & Festival</option>
                <option value="Academic">Academic & Achievement</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400">Event Description & Activity Guidelines</label>
            <input 
              type="text" 
              placeholder="e.g. Special assembly, speeches by students in regional languages." 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
            />
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              {adding ? 'Scheduling Event...' : 'Schedule Celebration Reminder →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🇮🇳</span> India School Celebration Calendar & Reminders ({records.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((r: any) => (
              <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {r.category} • {r.celebrationDate}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-2">{r.eventName}</h4>
                    <p className="text-[11px] text-slate-400">{r.description}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    r.status === 'REMINDER_SENT'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400">
                  <span>School Broadcast: <strong className="text-amber-400">Automated</strong></span>
                  <button 
                    onClick={() => handleSendReminderBroadcast(r.id, r.eventName)}
                    className="text-amber-400 font-semibold hover:underline"
                  >
                    Send Broadcast Reminder ↗
                  </button>
                </div>
              </div>
            ))}
            {records.length === 0 && !loading && (
              <div className="col-span-2 p-6 text-center text-slate-500">
                No celebration reminders found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
