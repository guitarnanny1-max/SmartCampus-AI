'use client';

import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, ArrowLeft, CheckCircle2, Search, Shuffle, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function TimetableModule() {
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const scheduleList = [
    { id: 1, period: 'Period 1', time: '09:00 - 09:50', subject: 'Advanced Algorithms', teacher: 'Prof. A. Sharma', room: 'Lab 402', status: 'On Track' },
    { id: 2, period: 'Period 2', time: '09:50 - 10:40', subject: 'Data Structures', teacher: 'Dr. B. Patel', room: 'Hall 101', status: 'Substitution Active' },
    { id: 3, period: 'Period 3', time: '11:00 - 11:50', subject: 'Cloud Architecture', teacher: 'Prof. C. Iyer', room: 'Lab 405', status: 'On Track' },
    { id: 4, period: 'Period 4', time: '11:50 - 12:40', subject: 'Machine Learning', teacher: 'Dr. D. Rao', room: 'Hall 202', status: 'On Track' },
  ];

  const handleRunOptimization = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3500);
  };

  const filteredSchedule = scheduleList.filter(item => 
    item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampusAI</h1>
            <span className="text-[10px] text-slate-400">Timetable Automation & Scheduling Hub</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Timetable Automation Engine</h2>
            <p className="text-xs text-slate-400 mt-1">Real-time conflict resolution, faculty substitution automation, and resource utilization optimization.</p>
          </div>
          <button
            onClick={handleRunOptimization}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Shuffle className="w-4 h-4" />
            <span>Run Schedule Optimization</span>
          </button>
        </div>

        {success && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Timetable optimization engine executed. 3 substitutions applied, 0 conflicts detected.</span>
          </div>
        )}

        {/* Timetable KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Active Schedules</div>
            <div className="text-3xl font-extrabold text-white">48</div>
            <div className="text-[10px] text-cyan-400 font-medium">Synced across departments</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Resource Conflicts</div>
            <div className="text-3xl font-extrabold text-emerald-400">0</div>
            <div className="text-[10px] text-slate-400">Engine status: Healthy</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Pending Substitutions</div>
            <div className="text-3xl font-extrabold text-amber-400">1</div>
            <div className="text-[10px] text-slate-400">Requires manual approval</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Avg. Faculty Utilization</div>
            <div className="text-3xl font-extrabold text-cyan-400">82%</div>
            <div className="text-[10px] text-slate-400">Balanced load distribution</div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Today's Academic Schedule</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search subject, teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredSchedule.map((item) => (
              <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.subject} • <span className="text-cyan-400 font-mono">{item.time}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Teacher: <strong className="text-slate-300">{item.teacher}</strong></span>
                    <span>Room: <strong className="text-slate-300">{item.room}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    item.status === 'On Track' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.status}
                  </span>
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-400 font-medium transition-colors cursor-pointer">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampusAI • Enterprise Multi-Tenant Institutional Operating System</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Powered by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
