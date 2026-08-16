'use client';

import React, { useState } from 'react';
import { Sparkles, UserCheck, BookOpen, DollarSign, Bus, Award, ArrowLeft, CheckCircle2, FileText, Download } from 'lucide-react';
import Link from 'next/link';

export default function StudentPortal() {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'grades' | 'fees' | 'transport' | 'notices'>('grades');

  const studentInfo = {
    name: 'Aarav Sharma',
    rollNo: 'CSE-2026-042',
    program: 'B.Tech Computer Science & Engineering',
    semester: '6th Semester',
    gpa: '9.42 / 10.0',
    attendance: '94.5%',
  };

  const gradeList = [
    { subject: 'Advanced Data Structures & Algorithms', code: 'CS-301', credits: 4, grade: 'A+', score: '94/100' },
    { subject: 'Artificial Intelligence & Neural Networks', code: 'CS-302', credits: 4, grade: 'A', score: '89/100' },
    { subject: 'Cloud Computing & Kubernetes Architectures', code: 'CS-303', credits: 3, grade: 'A+', score: '96/100' },
    { subject: 'Software Engineering & Agile Methodologies', code: 'CS-304', credits: 3, grade: 'B+', score: '82/100' },
  ];

  const handleDownloadReport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

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
            <span className="text-[10px] text-slate-400">Student & Parent Self-Service Portal</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        
        {/* Student Profile Card */}
        <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-cyan-950">
              AS
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold">
                Verified Student Account
              </div>
              <h2 className="text-2xl font-extrabold text-white">{studentInfo.name}</h2>
              <p className="text-xs text-slate-400">{studentInfo.program} • <strong className="text-cyan-400 font-mono">{studentInfo.rollNo}</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400">Current GPA</div>
              <div className="text-xl font-extrabold text-emerald-400">{studentInfo.gpa}</div>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400">Attendance</div>
              <div className="text-xl font-extrabold text-cyan-400">{studentInfo.attendance}</div>
            </div>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Official semester grade transcript generated and downloaded successfully as encrypted PDF.</span>
          </div>
        )}

        {/* Portal Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('grades')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'grades' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Academic Grades & Transcript
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'fees' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Fee Receipts & Dues
          </button>
          <button
            onClick={() => setActiveTab('transport')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'transport' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Bus GPS Telemetry
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'grades' && (
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>Semester Grade Report (6th Semester)</span>
              </h3>
              <button
                onClick={handleDownloadReport}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-cyan-400 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Transcript</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {gradeList.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{item.subject} • <span className="text-cyan-400 font-mono">{item.code}</span></div>
                    <div className="text-slate-400">Credits: <strong className="text-slate-300">{item.credits}</strong></div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400">{item.score}</div>
                      <div className="text-[10px] text-slate-400">Score</div>
                    </div>
                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full font-extrabold text-xs">
                      {item.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              <span>Tuition & Hostel Fee Status</span>
            </h3>
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-bold text-white text-sm">Semester 6 Tuition Fee (2026-27)</div>
                <div className="text-xs text-slate-400">Due Date: July 15, 2026 • Status: Paid in Full</div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold text-xs">
                Paid (₹1,25,000)
              </span>
            </div>
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bus className="w-5 h-5 text-cyan-400" />
              <span>Campus Shuttle Live GPS Telemetry</span>
            </h3>
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Assigned Route: Route #4 (Silicon Valley Expressway)</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold">On Time</span>
              </div>
              <div className="text-xs text-slate-400">Current Location: Sector 18 Junction (ETA to Campus: 8 mins)</div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus SaaS OS • Student & Parent Self-Service Portal</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Powered by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
