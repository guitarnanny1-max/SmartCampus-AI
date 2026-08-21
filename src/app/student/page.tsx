export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Award, 
  Bell, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const [student] = useState({
    name: 'Aarav Sharma',
    grade: 'Grade 11-A',
    roll: 'DPS-2026-001',
    gpa: 3.8,
    attendance: 94
  });

  const [assignments] = useState([
    { id: 1, subject: 'Calculus', title: 'Problem Set #4', dueDate: '2026-08-22', status: 'Pending' },
    { id: 2, subject: 'Physics', title: 'Lab Report: Kinematics', dueDate: '2026-08-24', status: 'Submitted' },
    { id: 3, subject: 'Literature', title: 'Essay Draft', dueDate: '2026-08-28', status: 'Pending' }
  ]);

  const schedule = [
    { time: '08:30 AM', subject: 'Calculus (Advanced)', room: 'Room 302' },
    { time: '10:00 AM', subject: 'Physics Lab', room: 'IT Lab 1' },
    { time: '11:30 AM', subject: 'English Literature', room: 'Room 204' },
    { time: '01:00 PM', subject: 'Lunch Break', room: 'Cafeteria' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Hello, {student.name}! 👋</h1>
            <p className="text-slate-400 mt-1">Welcome back to your DPS Student Portal.</p>
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-indigo-400">GPA: {student.gpa}</span>
             </div>
             <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">Attn: {student.attendance}%</span>
             </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content: Assignments & Schedule */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Assignments */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Upcoming Assignments
              </h2>
              <div className="space-y-3">
                {assignments.map((assign: any) => (
                  <div key={assign.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-slate-200">{assign.title}</h3>
                      <p className="text-xs text-slate-400">{assign.subject} • Due: {assign.dueDate}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${assign.status === 'Submitted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {assign.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
               <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Today's Schedule
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schedule.map((slot, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <p className="text-indigo-400 font-mono text-xs">{slot.time}</p>
                    <h3 className="font-semibold text-white mt-1">{slot.subject}</h3>
                    <p className="text-slate-500 text-xs mt-1">{slot.room}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Announcements & Grades */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                Announcements
              </h2>
              <div className="space-y-4">
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <p className="text-xs text-amber-200 font-medium">School Trip: Astronomy Club departs Friday at 07:00 AM.</p>
                </div>
                <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <p className="text-xs text-blue-200 font-medium">Mid-term results will be available in the portal by Aug 30.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                Performance Overview
              </h2>
              <div className="h-40 flex items-center justify-center border border-slate-800 rounded-xl bg-slate-950 text-slate-600 italic text-sm">
                Visual Chart placeholder
              </div>
            </div>
            
            <Link href="/" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all">
               Return to Master Hub <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
