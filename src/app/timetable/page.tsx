export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TimetablePage() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 10:30 AM');
  const [courseName, setCourseName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [instructor, setInstructor] = useState('');
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
    fetch('/api/timetable')
      .then(res => res.json())
      .then(data => {
        setSlots(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setScheduling(true);

    try {
      const res = await fetch('/api/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayOfWeek, timeSlot, courseName, roomNumber, instructor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule slot');

      setSlots([data, ...slots]);
      setCourseName('');
      setRoomNumber('');
      setInstructor('');
      alert('AI conflict check passed. Lecture slot successfully scheduled.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                ACADEMIC OPERATIONS
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">AI Timetable & Classroom Allocator</h1>
            <p className="text-xs text-slate-400">Manage lecture schedules, prevent room clashes, and optimize campus facility utilization.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSchedule} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📅</span> Schedule New Lecture Slot
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Day of Week</label>
              <select 
                value={dayOfWeek} 
                onChange={e => setDayOfWeek(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Time Slot</label>
              <select 
                value={timeSlot} 
                onChange={e => setTimeSlot(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="09:00 AM - 10:30 AM">09:00 AM - 10:30 AM</option>
                <option value="11:00 AM - 12:30 PM">11:00 AM - 12:30 PM</option>
                <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM</option>
                <option value="04:00 PM - 05:30 PM">04:00 PM - 05:30 PM</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Course Name</label>
              <input 
                type="text" 
                placeholder="e.g. Machine Learning 101" 
                value={courseName} 
                onChange={e => setCourseName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Room Number / Hall</label>
              <input 
                type="text" 
                placeholder="e.g. Lecture Hall B" 
                value={roomNumber} 
                onChange={e => setRoomNumber(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Instructor</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Richard Feynman" 
                value={instructor} 
                onChange={e => setInstructor(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={scheduling} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {scheduling ? 'Allocating Room...' : 'Schedule Lecture Slot →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏛️</span> Active Timetable & Allocations ({slots.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Day</th>
                  <th className="p-4 font-medium">Time Slot</th>
                  <th className="p-4 font-medium">Course Name</th>
                  <th className="p-4 font-medium">Room / Hall</th>
                  <th className="p-4 font-medium text-right">Instructor</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((s: any) => (
                  <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-bold text-cyan-400">{s.dayOfWeek}</td>
                    <td className="p-4 font-mono text-slate-300">{s.timeSlot}</td>
                    <td className="p-4 font-semibold text-white">{s.courseName}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {s.roomNumber}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-300">{s.instructor}</td>
                  </tr>
                ))}
                {slots.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No timetable slots scheduled.
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
