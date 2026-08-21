export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { Sparkles, Briefcase, Users, DollarSign, ArrowLeft, CheckCircle2, Search, ShieldCheck, Calendar, FileText, Award } from 'lucide-react';
import Link from 'next/link';

export default function PayrollModule() {
  const [payrollSuccess, setPayrollSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const staffList = [
    { id: 'EMP-101', name: 'Dr. Robert Thorne', role: 'Professor & Dean of Computer Science', department: 'Engineering', salary: '₹1,85,000 / mo', status: 'Disbursed', attendance: '26 / 26 Days' },
    { id: 'EMP-102', name: 'Prof. Ananya Sharma', role: 'Associate Professor', department: 'Mathematics', salary: '₹1,40,000 / mo', status: 'Disbursed', attendance: '25 / 26 Days' },
    { id: 'EMP-103', name: 'Vikram Malhotra', role: 'Senior Systems Administrator', department: 'IT Infrastructure', salary: '₹95,000 / mo', status: 'Disbursed', attendance: '26 / 26 Days' },
    { id: 'EMP-104', name: 'Dr. Elizabeth Vance', role: 'Head of Physics Department', department: 'Basic Sciences', salary: '₹1,60,000 / mo', status: 'Pending Approval', attendance: '24 / 26 Days' },
  ];

  const handleRunPayroll = () => {
    setPayrollSuccess(true);
    setTimeout(() => setPayrollSuccess(false), 3500);
  };

  const filteredStaff = staffList.filter((item: any) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.department.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-[10px] text-slate-400">HR & Staff Payroll Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">HR & Staff Payroll Management</h2>
            <p className="text-xs text-slate-400 mt-1">Manage faculty directories, biometric attendance synchronization, tax deductions (TDS), and monthly salary disbursements.</p>
          </div>
          <button
            onClick={handleRunPayroll}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <DollarSign className="w-4 h-4" />
            <span>Process Monthly Payroll Cycle</span>
          </button>
        </div>

        {payrollSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Monthly payroll disbursement executed successfully through bank direct-deposit gateway. Pay slips dispatched to staff email.</span>
          </div>
        )}

        {/* HR KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Total Active Personnel</div>
            <div className="text-3xl font-extrabold text-white">124 Staff</div>
            <div className="text-[10px] text-emerald-400 font-medium">Biometric synchronized</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Monthly Payroll Outflow</div>
            <div className="text-3xl font-extrabold text-cyan-400">₹1.84 Cr</div>
            <div className="text-[10px] text-slate-400">Direct bank transfer active</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Staff Attendance Rate</div>
            <div className="text-3xl font-extrabold text-emerald-400">97.8%</div>
            <div className="text-[10px] text-slate-400">Real-time facial scanner verified</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Pending Leave Requests</div>
            <div className="text-3xl font-extrabold text-amber-400">6 Requests</div>
            <div className="text-[10px] text-slate-400">Requires department head review</div>
          </div>
        </div>

        {/* Staff Payroll Table */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <span>Faculty & Staff Salary Ledger</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search staff name, role, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredStaff.map((staff: any) => (
              <div key={staff.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{staff.name} • <span className="text-cyan-400 font-mono">{staff.id}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Role: <strong className="text-slate-300">{staff.role}</strong></span>
                    <span>Department: <strong className="text-slate-300">{staff.department}</strong></span>
                    <span>Attendance: <strong className="text-slate-300">{staff.attendance}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-400">{staff.salary}</div>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                      staff.status === 'Disbursed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {staff.status}
                    </span>
                  </div>
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-400 font-medium transition-colors cursor-pointer">
                    View Slip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus SaaS OS • Enterprise HR & Staff Payroll Management</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Powered by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
