'use client';

import React, { useState } from 'react';
import { Sparkles, Calendar, Users, Video, ArrowLeft, CheckCircle2, Search, Building2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PTMModule() {
  const [ptmSuccess, setPtmSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const appointments = [
    { id: 1, parentName: 'Vikram Mehta', student: 'Aarav Mehta (Grade 11)', teacher: 'Dr. R. Sharma (Physics)', timeSlot: '10:00 AM - 10:15 AM', mode: 'Virtual WebRTC', status: 'Confirmed' },
    { id: 2, parentName: 'Sunita Sharma', student: 'Ananya Sharma (Grade 9)', teacher: 'Prof. K. Iyer (Mathematics)', timeSlot: '10:30 AM - 10:45 AM', mode: 'In-Person Room 204', status: 'Confirmed' },
    { id: 3, parentName: 'Rajeev Kapoor', student: 'Kabir Kapoor (Grade 6)', teacher: 'Ms. A. Sen (English)', timeSlot: '11:00 AM - 11:15 AM', mode: 'Virtual WebRTC', status: 'Completed' },
    { id: 4, parentName: 'Amitabh Sen', student: 'Diya Sen (Grade 12)', teacher: 'Mr. P. Verma (Economics)', timeSlot: '11:30 AM - 11:45 AM', mode: 'Virtual WebRTC', status: 'Confirmed' },
  ];

  const handleBookSlot = () => {
    setPtmSuccess(true);
    setTimeout(() => setPtmSuccess(false), 3500);
  };

  const filteredAppointments = appointments.filter(apt => 
    apt.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.student.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus SaaS OS</h1>
            <span className="text-[10px] text-slate-400">Parent-Teacher Meeting & Slot Booking Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Parent-Teacher Meeting (PTM) Portal</h2>
            <p className="text-xs text-slate-400 mt-1">Manage consultation calendars, automated WhatsApp time-slot booking, and virtual WebRTC video conference rooms.</p>
          </div>
          <button
            onClick={handleBookSlot}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule PTM Consultation</span>
          </button>
        </div>

        {ptmSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Consultation slot booked successfully and calendar invites dispatched to parent and faculty!</span>
          </div>
        )}

        {/* PTM KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Total Booked Sessions</div>
            <div className="text-3xl font-extrabold text-white">410 Sessions</div>
            <div className="text-[10px] text-cyan-400 font-medium">96% consultation slot utilization</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Virtual WebRTC Rooms</div>
            <div className="text-3xl font-extrabold text-white">24 Active Rooms</div>
            <div className="text-[10px] text-cyan-400 font-medium">HD video & screen sharing online</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Parent Attendance Rate</div>
            <div className="text-3xl font-extrabold text-emerald-400">98.2%</div>
            <div className="text-[10px] text-slate-400">Automated WhatsApp reminders active</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Average Duration</div>
            <div className="text-3xl font-extrabold text-white">15 Mins/Slot</div>
            <div className="text-[10px] text-cyan-400 font-medium">Strict automated time-boxing</div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>PTM Consultation Schedule Roster</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search parent, teacher, student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredAppointments.map((apt) => (
              <div key={apt.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{apt.parentName} & <span className="text-cyan-400">{apt.teacher}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Student: <strong className="text-slate-300">{apt.student}</strong></span>
                    <span>Mode: <strong className="text-slate-300">{apt.mode}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-slate-300 text-xs">{apt.timeSlot}</span>
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    apt.status === 'Confirmed' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {apt.status}
                  </span>
                  <button className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-colors cursor-pointer">
                    <Video className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
