'use client';

import { useState } from "react";

export default function ExaminationsPage() {
  const [exams, setExams] = useState([
    { id: "EXM-001", name: "Term 1 Mid-Term Assessment", class: "Grade 10", date: "2026-09-15 to 2025-09-25", status: "Scheduled", grading: "CBSE 8-Point Scale", reports: "Pending" },
    { id: "EXM-002", name: "Unit Test 2 (Science & Math)", class: "Grade 8", date: "2026-08-10", status: "Grading Complete", grading: "Percentage", reports: "Generated" },
    { id: "EXM-003", name: "Pre-Board Mock Examinations", class: "Grade 12", date: "2026-10-01", status: "Drafting Schedule", grading: "ICSE Scale", reports: "Not Started" },
    { id: "EXM-004", name: "Class Test Series 1", class: "Grade 6", date: "2026-08-05", status: "Published", grading: "Letter Grades", reports: "Sent to Parents" },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full font-semibold border border-indigo-500/20">
            Academic Core Module
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Examinations & Gradebook</h1>
          <p className="text-slate-400 text-sm mt-1">Manage exam timetables, mark entry, board grading standards, and batch report card generation.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow">
          + Schedule New Exam
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Exams</div>
          <div className="text-3xl font-extrabold text-white mt-2">4 Series</div>
          <div className="text-[11px] text-emerald-400 mt-1">Synchronized with calendar</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Overall Pass Rate</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">96.4%</div>
          <div className="text-[11px] text-slate-500 mt-1">+1.8% vs last term</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Report Cards Ready</div>
          <div className="text-3xl font-extrabold text-indigo-400 mt-2">1,240</div>
          <div className="text-[11px] text-slate-500 mt-1">Published to parent portals</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Mark Entries</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">2 Classes</div>
          <div className="text-[11px] text-amber-400 mt-1">Awaiting teacher submission</div>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200">
          Examination Schedules & Gradebook Status
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Exam ID</th>
                <th className="px-6 py-3 font-semibold">Assessment Name</th>
                <th className="px-6 py-3 font-semibold">Target Class</th>
                <th className="px-6 py-3 font-semibold">Dates</th>
                <th className="px-6 py-3 font-semibold">Grading Standard</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Report Cards</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {exams.map((ex: any) => (
                <tr key={ex.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono font-bold text-indigo-400">{ex.id}</td>
                  <td className="px-6 py-4 font-bold text-white">{ex.name}</td>
                  <td className="px-6 py-4 text-slate-300">{ex.class}</td>
                  <td className="px-6 py-4 text-slate-400">{ex.date}</td>
                  <td className="px-6 py-4 text-slate-300">{ex.grading}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      ex.status === "Published" || ex.status === "Grading Complete"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    }`}>
                      {ex.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-300">{ex.reports}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-slate-400 hover:text-white font-medium">Marks</button>
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">Reports</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
