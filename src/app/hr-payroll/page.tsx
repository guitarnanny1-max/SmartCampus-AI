export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { Sparkles, Users, DollarSign, Calendar, ShieldCheck, ArrowLeft, CheckCircle2, Briefcase, FileText, Clock } from 'lucide-react';
import Link from 'next/link';

export default function HRPayrollModule() {
  const [payrollMonth, setPayrollMonth] = useState('June 2026');
  const [disburseSuccess, setDisburseSuccess] = useState(false);

  const staff = [
    { id: 1, name: 'Dr. R. Sharma', role: 'Head of Mathematics Department', baseSalary: '₹95,000', status: 'Disbursed', date: 'June 01, 2026' },
    { id: 2, name: 'Prof. A. Verma', role: 'Senior Physics Faculty', baseSalary: '₹88,000', status: 'Disbursed', date: 'June 01, 2026' },
    { id: 3, name: 'Ms. Priya Sen', role: 'Computer Science Instructor', baseSalary: '₹75,000', status: 'Pending Approval', date: 'Processing' },
    { id: 4, name: 'Mr. Rajesh Kumar', role: 'Transport Fleet Supervisor', baseSalary: '₹42,000', status: 'Disbursed', date: 'June 01, 2026' },
  ];

  const handleDisbursePayroll = () => {
    setDisburseSuccess(true);
    setTimeout(() => setDisburseSuccess(false), 3500);
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
            <span className="text-[10px] text-slate-400">Institutional HR, Staff Attendance & Payroll</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Staff HR & Automated Payroll</h2>
            <p className="text-xs text-slate-400 mt-1">Manage teacher salaries, tax withholding (TDS), leave tracking, and direct bank transfer disbursements.</p>
          </div>
          <button
            onClick={handleDisbursePayroll}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <DollarSign className="w-4 h-4" />
            <span>Process Monthly Payroll Run</span>
          </button>
        </div>

        {disburseSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Monthly payroll disbursement successfully processed via secure institutional banking gateway!</span>
          </div>
        )}

        {/* HR KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Total Active Staff</div>
            <div className="text-3xl font-extrabold text-white">142 Employees</div>
            <div className="text-[10px] text-cyan-400 font-medium">98.5% attendance rate</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Monthly Payroll Outlay</div>
            <div className="text-3xl font-extrabold text-white">₹1.12 Crores</div>
            <div className="text-[10px] text-cyan-400 font-medium">Direct bank transfer synchronized</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Leave Requests Pending</div>
            <div className="text-3xl font-extrabold text-cyan-400">6 Requests</div>
            <div className="text-[10px] text-slate-400">Requires administrative review</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Tax Compliance (TDS)</div>
            <div className="text-3xl font-extrabold text-white">100% Filed</div>
            <div className="text-[10px] text-cyan-400 font-medium">Quarterly filings up to date</div>
          </div>
        </div>

        {/* Staff Payroll Roster */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Staff Salary & Disbursement Roster • {payrollMonth}</span>
            </h3>
            <span className="text-xs text-slate-400">Tenant isolated payroll schema</span>
          </div>

          <div className="space-y-3 text-xs">
            {staff.map((member: any) => (
              <div key={member.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{member.name}</div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Role: <strong className="text-slate-300">{member.role}</strong></span>
                    <span>Base Salary: <strong className="text-cyan-400">{member.baseSalary}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    member.status === 'Disbursed' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {member.status}
                  </span>
                  <span className="text-slate-500 text-[11px] font-mono">{member.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
