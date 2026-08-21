export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { Sparkles, Users, UserCheck, Clock, ArrowLeft, CheckCircle2, Search, UserMinus, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function AttendanceModule() {
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const attendanceLog = [
    { id: 1, name: 'Dr. Ramesh Kumar', role: 'Department Head', timeIn: '08:45 AM', status: 'Present', payrollStatus: 'Verified' },
    { id: 2, name: 'Prof. Anita Desai', role: 'Faculty', timeIn: '-', status: 'On Leave', payrollStatus: 'Pending' },
    { id: 3, name: 'Capt. Suresh Rao', role: 'Admin Staff', timeIn: '09:02 AM', status: 'Present', payrollStatus: 'Verified' },
    { id: 4, name: 'Dr. B. Patel', role: 'Faculty', timeIn: '08:55 AM', status: 'Present', payrollStatus: 'Verified' },
  ];

  const handleSyncAttendance = () => {
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3500);
  };

  const filteredLogs = attendanceLog.filter((item: any) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.role.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-[10px] text-slate-400">Attendance & HR Management Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Attendance & HR Engine</h2>
            <p className="text-xs text-slate-400 mt-1">Monitor staff attendance, manage leaves, and verify payroll ledger entries.</p>
          </div>
          <button
            onClick={handleSyncAttendance}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <UserCheck className="w-4 h-4" />
            <span>Sync Biometrics</span>
          </button>
        </div>

        {syncSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Biometric attendance data successfully synchronized with central HR portal.</span>
          </div>
        )}

        {/* HR KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Total Staff Active</div>
            <div className="text-3xl font-extrabold text-white">482</div>
            <div className="text-[10px] text-cyan-400 font-medium">98% present today</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">On Leave/Absent</div>
            <div className="text-3xl font-extrabold text-rose-400">12</div>
            <div className="text-[10px] text-slate-400">Requires review</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Payroll Compliance</div>
            <div className="text-3xl font-extrabold text-emerald-400">99.2%</div>
            <div className="text-[10px] text-slate-400">Audit approved</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Pending Approvals</div>
            <div className="text-3xl font-extrabold text-amber-400">5</div>
            <div className="text-[10px] text-slate-400">Leave requests</div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Staff Attendance Ledger</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search staff, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredLogs.map((log: any) => (
              <div key={log.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{log.name} • <span className="text-cyan-400">{log.role}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>In-Time: <strong className="text-slate-300">{log.timeIn}</strong></span>
                    <span>Payroll: <strong className={log.payrollStatus === 'Verified' ? 'text-emerald-400' : 'text-amber-400'}>{log.payrollStatus}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] flex items-center gap-1 ${
                    log.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 
                    'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {log.status === 'On Leave' && <UserMinus className="w-3 h-3" />}
                    {log.status}
                  </span>
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-400 font-medium transition-colors cursor-pointer">
                    View Logs
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
