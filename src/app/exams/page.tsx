'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Award, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Calendar,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default function ExamsPortal() {
  const [grades] = useState([
    { id: 1, subject: 'Advanced Calculus', code: 'MTH-501', grade: 'A+', score: '96%', credits: 4, term: 'Fall 2026' },
    { id: 2, subject: 'Quantum Physics', code: 'PHY-402', grade: 'A', score: '92%', credits: 4, term: 'Fall 2026' },
    { id: 3, subject: 'Organic Chemistry II', code: 'CHE-303', grade: 'B+', score: '88%', credits: 3, term: 'Fall 2026' },
    { id: 4, subject: 'English Literature & Composition', code: 'ENG-201', grade: 'A+', score: '95%', credits: 3, term: 'Fall 2026' }
  ]);

  const [upcomingExams] = useState([
    { id: 1, subject: 'Advanced Calculus Mid-Term', date: 'Sept 12, 2026', time: '09:00 AM', venue: 'Hall A' },
    { id: 2, subject: 'Quantum Physics Practical Exam', date: 'Sept 15, 2026', time: '11:30 AM', venue: 'Lab 3' },
    { id: 3, subject: 'Organic Chemistry Quiz', date: 'Sept 18, 2026', time: '02:00 PM', venue: 'Room 204' }
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono rounded-full uppercase">
                Portal: Examination & Academic Records
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">Gradebook & Assessments 📊</h1>
            <p className="text-slate-400 text-sm">Delhi Public School • Academic Performance & Transcripts</p>
          </div>
          <div className="flex gap-3">
             <Link href="/dashboard" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-colors">
                Master Hub
             </Link>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-slate-400 font-mono">Current CGPA</span>
            </div>
            <span className="text-2xl font-bold text-emerald-400">3.92 / 4.0</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span className="text-xs text-slate-400 font-mono">Enrolled Credits</span>
            </div>
            <span className="text-2xl font-bold text-white">15</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-slate-400 font-mono">Upcoming Exams</span>
            </div>
            <span className="text-2xl font-bold text-cyan-400">3</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              <span className="text-xs text-slate-400 font-mono">Academic Standing</span>
            </div>
            <span className="text-2xl font-bold text-amber-400">Dean's List</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Gradebook Table */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Current Term Transcript
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase font-mono">
                    <th className="py-3 px-4 font-semibold">Course</th>
                    <th className="py-3 px-4 font-semibold">Code</th>
                    <th className="py-3 px-4 font-semibold">Score</th>
                    <th className="py-3 px-4 font-semibold">Grade</th>
                    <th className="py-3 px-4 font-semibold">Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {grades.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-sm text-slate-200">{item.subject}</td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">{item.code}</td>
                      <td className="py-3 px-4 text-xs font-bold text-cyan-400">{item.score}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">{item.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Exam Schedule
              </h2>
              <div className="space-y-3">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <h3 className="font-semibold text-xs text-slate-200">{exam.subject}</h3>
                    <p className="text-[10px] text-cyan-400 font-mono">{exam.date} • {exam.time}</p>
                    <p className="text-[10px] text-slate-500">Venue: {exam.venue}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/20 p-6 rounded-2xl">
              <h3 className="font-bold text-white text-sm">Official Transcript Request</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Need a verified digital copy of your transcript for universities or scholarships? Generate signed copies instantly.
              </p>
              <button className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-xs font-bold text-white transition-all">
                Download Transcript (PDF)
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
