export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { Sparkles, Users, Award, BookMarked, ArrowLeft, CheckCircle2, Search, DollarSign, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function FacultyModule() {
  const [payrollSuccess, setPayrollSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const facultyList = [
    { name: 'Dr. Alok Mukherjee', dept: 'Computer Science & Engineering', role: 'Professor & Head of Dept', grants: '$1.2M Active', status: 'Tenured' },
    { name: 'Dr. Sarah Jenkins', dept: 'Artificial Intelligence Lab', role: 'Senior AI Researcher', grants: '$2.5M Active', status: 'Tenured' },
    { name: 'Prof. Rajesh Kothari', dept: 'VLSI & Microelectronics', role: 'Associate Professor', grants: '$800K Active', status: 'On Sabbatical' },
    { name: 'Dr. Elena Rostova', dept: 'Financial Engineering', role: 'Assistant Professor', grants: '$450K Active', status: 'Active' },
  ];

  const handleRunPayroll = () => {
    setPayrollSuccess(true);
    setTimeout(() => setPayrollSuccess(false), 3500);
  };

  const filteredFaculty = facultyList.filter((item: any) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus AI</h1>
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Faculty & Academic HR Hub</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Faculty Management & Academic HR</h2>
            <p className="text-xs text-slate-400 mt-1">Manage professorial tenures, research grants, department workloads, and automated monthly payroll disbursals.</p>
          </div>
          <button
            onClick={handleRunPayroll}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <DollarSign className="w-4 h-4" />
            <span>Initiate Monthly Faculty Payroll</span>
          </button>
        </div>

        {payrollSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Monthly faculty payroll successfully processed and direct-deposited across all institutional bank accounts.</span>
          </div>
        )}

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Total Faculty Members</div>
            <div className="text-3xl font-extrabold text-white">480+</div>
            <div className="text-[10px] text-slate-400">Across 18 academic departments</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Active Research Grants</div>
            <div className="text-3xl font-extrabold text-emerald-400">$34,200,000</div>
            <div className="text-[10px] text-emerald-400 font-medium">Global corporate & government funding</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Tenured Professors</div>
            <div className="text-3xl font-extrabold text-cyan-400">310</div>
            <div className="text-[10px] text-slate-400">Peer-reviewed publications active</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Faculty-to-Student Ratio</div>
            <div className="text-3xl font-extrabold text-white">1 : 14</div>
            <div className="text-[10px] text-slate-400">Exceeds global accreditation standards</div>
          </div>
        </div>

        {/* Faculty Ledger */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Faculty Directory & Research Grants Ledger</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search faculty name, department, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredFaculty.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.name} • <span className="text-cyan-400">{item.role}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Department: <strong className="text-slate-300">{item.dept}</strong></span>
                    <span>Research Grants: <strong className="text-emerald-400 font-mono">{item.grants}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    item.status === 'Tenured' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    item.status === 'Active' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.status}
                  </span>
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-400 font-medium transition-colors cursor-pointer">
                    View Dossier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Faculty & Academic HR Hub</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
