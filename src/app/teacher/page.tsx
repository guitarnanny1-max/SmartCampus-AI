export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Check, 
  Sparkles, 
  Send, 
  Layers, 
  FileText, 
  Plus, 
  Award, 
  UserCheck, 
  Bell,
  Briefcase,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
  // Teacher Profile State
  const [teacher, setTeacher] = useState({
    name: 'Dr. Ramesh Kumar',
    department: 'Mathematics & Advanced Calculus',
    employeeId: 'DPS-EMP-104',
    room: 'Room 302',
    classesToday: 4,
    totalStudents: 135
  });

  // AI Lesson Planner Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello Dr. Kumar! I'm your AI Lesson Planner Co-Pilot. Need help generating AP Calculus problem sets, rubric templates, or quiz questions for Grade 11?" }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Student Attendance State
  const [roster, setRoster] = useState([
    { id: 1, name: 'Aarav Sharma', roll: 'DPS-2026-001', grade: 'Grade 11-A', status: 'Present' },
    { id: 2, name: 'Diya Patel', roll: 'DPS-2026-002', grade: 'Grade 11-A', status: 'Present' },
    { id: 3, name: 'Kabir Mehta', roll: 'DPS-2026-003', grade: 'Grade 11-A', status: 'Absent' },
    { id: 4, name: 'Ananya Iyer', roll: 'DPS-2026-004', grade: 'Grade 11-A', status: 'Present' },
    { id: 5, name: 'Rohan Verma', roll: 'DPS-2026-005', grade: 'Grade 11-A', status: 'Present' }
  ]);

  // Homework Assignments Creator State
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Calculus Problem Set #4', dueDate: '2026-08-22', submissions: 41, total: 45 },
    { id: 2, title: 'Limits & Continuity Quiz Prep', dueDate: '2026-08-26', submissions: 12, total: 45 }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // Timetable State
  const schedule = [
    { time: '08:30 AM - 09:45 AM', class: 'Grade 11-A (Calculus)', room: 'Room 302', status: 'Completed' },
    { time: '10:00 AM - 11:15 AM', class: 'Grade 12-B (Advanced Math)', room: 'Room 304', status: 'In Progress' },
    { time: '11:30 AM - 12:45 PM', class: 'Faculty Senate Meeting', room: 'Conference Hall', status: 'Upcoming' },
    { time: '02:00 PM - 03:15 PM', class: 'Grade 11-B (Calculus Lab)', room: 'IT Lab 1', status: 'Upcoming' }
  ];

  const toggleAttendance = (id: number) => {
    setRoster(roster.map((r: any) => r.id === id ? { ...r, status: r.status === 'Present' ? 'Absent' : 'Present' } : r));
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate) return;
    setAssignments([
      { id: assignments.length + 1, title: newTitle, dueDate: newDueDate, submissions: 0, total: 45 },
      ...assignments
    ]);
    setNewTitle('');
    setNewDueDate('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = "I've structured your lesson materials according to the AP Calculus curriculum guidelines.";
      const lower = userMsg.toLowerCase();
      if (lower.includes('calculus') || lower.includes('problem')) {
        reply = "Here are 5 advanced derivative problems focusing on trigonometric substitution and product rule applications.";
      } else if (lower.includes('quiz') || lower.includes('test')) {
        reply = "Generated a 15-question multiple choice quiz on Limits & Continuity with answer keys.";
      } else if (lower.includes('rubric')) {
        reply = "Standard 4-point grading rubric created for lab reports and mathematical proofs.";
      }
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setIsAiThinking(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header & Teacher Profile Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xl font-mono shadow-lg shadow-indigo-500/10">
              RK
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono rounded-full uppercase">
                  Portal: Teacher Dashboard
                </span>
                <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono rounded-full">
                  ID: {teacher.employeeId}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Welcome, {teacher.name} 👨‍🏫
              </h1>
              <p className="text-slate-400 text-xs md:text-sm">
                Delhi Public School • {teacher.department} • {teacher.room}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dps" className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors">
              <Layers className="w-4 h-4 text-cyan-400" /> Tenant Admin View
            </Link>
            <Link href="/dashboard" className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors">
              Master Hub
            </Link>
          </div>
        </div>

        {/* Quick Teacher Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono">Today's Classes</span>
              <div className="text-2xl font-bold text-indigo-400">{teacher.classesToday} Sessions</div>
            </div>
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono">Total Students</span>
              <div className="text-2xl font-bold text-cyan-400">{teacher.totalStudents} Enrolled</div>
            </div>
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono">Active Assignments</span>
              <div className="text-2xl font-bold text-emerald-400">{assignments.length} Tasks</div>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono">Faculty Status</span>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Present & Active
              </div>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* SECTION 1: Student Attendance Roster (Grade 11-A) */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              Class Attendance Roster • Grade 11-A (Calculus)
            </h3>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
              Click status to toggle Present / Absent
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {roster.map((student: any) => (
              <div key={student.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400">{student.roll}</span>
                  <div className="font-bold text-slate-100 text-sm">{student.name}</div>
                  <div className="text-slate-400 text-xs font-mono">{student.grade}</div>
                </div>

                <button 
                  onClick={() => toggleAttendance(student.id)}
                  className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    student.status === 'Present' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' :
                    'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}
                >
                  {student.status}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Homework Assignment Creator & Timetable */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Assignment Creator */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                Assign Homework & Problem Sets
              </h3>
              <span className="text-xs font-mono text-slate-400">Active Publisher</span>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <input 
                type="text" 
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)} 
                placeholder="Assignment Title (e.g. Integration Problem Set #2)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex gap-2">
                <input 
                  type="date" 
                  value={newDueDate} 
                  onChange={e => setNewDueDate(e.target.value)} 
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1 shadow-md shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" /> Publish Task
                </button>
              </div>
            </form>

            <div className="space-y-2.5 max-h-40 overflow-y-auto">
              {assignments.map((item: any) => (
                <div key={item.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="font-bold text-slate-200">{item.title}</div>
                    <div className="text-slate-400">Due: {item.dueDate}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg text-[10px] font-bold">
                    Submissions: {item.submissions}/{item.total}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Timetable & Schedule */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                Today's Teaching Schedule
              </h3>
              <span className="text-xs font-mono text-slate-400">Monday, Aug 17</span>
            </div>

            <div className="space-y-2.5">
              {schedule.map((sch, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-200 text-sm">{sch.class}</div>
                    <div className="text-slate-400">Location: <span className="text-cyan-400">{sch.room}</span></div>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    sch.status === 'Completed' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' :
                    sch.status === 'In Progress' ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {sch.time} • {sch.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SECTION 3: AI Lesson Planner Co-Pilot */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                AI Lesson Planner Co-Pilot
              </h3>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                Curriculum Expert Active
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 h-40 overflow-y-auto space-y-3 text-xs font-mono">
              {messages.map((m, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl max-w-[85%] ${m.sender === 'user' ? 'bg-cyan-500/10 text-cyan-200 ml-auto border border-cyan-500/20' : 'bg-slate-900 text-slate-300 mr-auto border border-slate-800'}`}>
                  {m.text}
                </div>
              ))}
              {isAiThinking && (
                <div className="p-2.5 bg-slate-900 text-slate-400 rounded-xl max-w-[85%] mr-auto italic">
                  AI is synthesizing AP Calculus problem sets and rubrics...
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 mt-3 border-t border-slate-800">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask for calculus problem sets, quiz questions, or grading rubrics..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" /> Ask AI
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
