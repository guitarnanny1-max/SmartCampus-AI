'use client';

import React, { useState } from 'react';
import { Sparkles, Users, Shield, BookOpen, DollarSign, Calendar, ArrowLeft, CheckCircle2, FileText, Bus, Check, Award } from 'lucide-react';
import Link from 'next/link';

export default function RolePortalModule() {
  const [role, setRole] = useState<'admin' | 'teacher' | 'parent' | 'student'>('teacher');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus OS</h1>
            <span className="text-[10px] text-slate-400">Unified Role-Based Access Control (RBAC)</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Stakeholder Role Portals</h2>
            <p className="text-xs text-slate-400 mt-1">Switch between institutional roles to experience tailored workflows, gradebooks, and analytics.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full w-fit">
            <Shield className="w-3.5 h-3.5" /> Secure RBAC Active
          </span>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setRole('admin')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              role === 'admin'
                ? 'bg-cyan-600 border-cyan-500 text-white font-bold shadow-xl shadow-cyan-950'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-sm font-bold">Administrator</div>
            <div className="text-[10px] opacity-80 mt-1">Full Campus Control & Analytics</div>
          </button>

          <button
            onClick={() => setRole('teacher')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              role === 'teacher'
                ? 'bg-cyan-600 border-cyan-500 text-white font-bold shadow-xl shadow-cyan-950'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-sm font-bold">Teacher Portal</div>
            <div className="text-[10px] opacity-80 mt-1">Gradebooks, Attendance & AI Planner</div>
          </button>

          <button
            onClick={() => setRole('parent')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              role === 'parent'
                ? 'bg-cyan-600 border-cyan-500 text-white font-bold shadow-xl shadow-cyan-950'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-sm font-bold">Parent Portal</div>
            <div className="text-[10px] opacity-80 mt-1">Fee Pay, Bus GPS & Report Cards</div>
          </button>

          <button
            onClick={() => setRole('student')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              role === 'student'
                ? 'bg-cyan-600 border-cyan-500 text-white font-bold shadow-xl shadow-cyan-950'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-sm font-bold">Student Portal</div>
            <div className="text-[10px] opacity-80 mt-1">Assignments, Timetable & Quizzes</div>
          </button>
        </div>

        {/* Dynamic Role View */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          {role === 'admin' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span>Administrator Command Cockpit</span>
                </h3>
                <span className="text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">Super Admin Access</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="text-slate-400">Total Faculty Active</div>
                  <div className="text-2xl font-extrabold text-white">142 Staff</div>
                  <Link href="/dashboard" className="text-cyan-400 hover:underline inline-block pt-2">View Payroll & HR →</Link>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="text-slate-400">Admissions Pipeline</div>
                  <div className="text-2xl font-extrabold text-white">384 Inquiries</div>
                  <Link href="/dashboard" className="text-cyan-400 hover:underline inline-block pt-2">Manage CRM Leads →</Link>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="text-slate-400">Fleet Security Status</div>
                  <div className="text-2xl font-extrabold text-white">24 Buses Online</div>
                  <Link href="/transport" className="text-cyan-400 hover:underline inline-block pt-2">Open GPS Telemetry →</Link>
                </div>
              </div>
            </div>
          )}

          {role === 'teacher' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <span>Teacher Portal • Prof. Ananya Sharma (Mathematics)</span>
                </h3>
                <span className="text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">Grade 10 Lead</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="font-bold text-white text-sm">Today's Schedule</div>
                  <div className="space-y-2 text-slate-300">
                    <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between">
                      <span>Period 2: Grade 10-A (Quadratic Equations)</span>
                      <span className="text-cyan-400 font-semibold">09:30 AM</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between">
                      <span>Period 4: Grade 10-B (Trigonometry)</span>
                      <span className="text-cyan-400 font-semibold">11:15 AM</span>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="font-bold text-white text-sm">Quick AI Tools</div>
                  <p className="text-slate-400">Instantly create lesson plans, quizzes, and grading rubrics using our pedagogical AI assistant.</p>
                  <Link href="/academics" className="inline-block px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all">
                    Launch AI Lesson Planner →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {role === 'parent' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>Parent Portal • Guardian of Aarav Sharma (Grade 10-A)</span>
                </h3>
                <span className="text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">Fee Status: Paid</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="text-slate-400">Attendance Today</div>
                  <div className="text-2xl font-extrabold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5" /> Present (08:28 AM)
                  </div>
                  <div className="text-[10px] text-slate-400">Biometric verified</div>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="text-slate-400">Bus Transit Tracking</div>
                  <div className="text-xl font-extrabold text-white">Bus 101 (En Route)</div>
                  <Link href="/transport" className="text-cyan-400 hover:underline inline-block pt-1">Track Live GPS Location →</Link>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="text-slate-400">Term Examination Report</div>
                  <div className="text-2xl font-extrabold text-white">92.4% (A+ Grade)</div>
                  <button onClick={() => alert('Report card downloaded successfully!')} className="text-cyan-400 hover:underline pt-1 block">Download PDF Card ↓</button>
                </div>
              </div>
            </div>
          )}

          {role === 'student' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-cyan-400" />
                  <span>Student Portal • Aarav Sharma (Grade 10-A, Roll #12)</span>
                </h3>
                <span className="text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">Standing: Top 5%</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="font-bold text-white text-sm">Pending Assignments</div>
                  <div className="space-y-2 text-slate-300">
                    <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between">
                      <span>Physics Lab Report (Electromagnetism)</span>
                      <span className="text-amber-400 font-semibold">Due Tomorrow</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between">
                      <span>Mathematics Problem Set 4</span>
                      <span className="text-cyan-400 font-semibold">Due Aug 20</span>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="font-bold text-white text-sm">Interactive Quizzes & Practice</div>
                  <p className="text-slate-400">Access AI-generated practice tests and chapter summaries prepared by your teachers.</p>
                  <Link href="/academics" className="inline-block px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all">
                    Open Practice Hub →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
