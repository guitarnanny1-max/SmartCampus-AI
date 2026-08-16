'use client';

import React, { useState } from 'react';
import { Sparkles, Users, Briefcase, ArrowLeft, CheckCircle2, Search, ShieldCheck, DollarSign, Download, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function HRModule() {
  const [hrSuccess, setHrSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const staffList = [
    { id: 1, name: 'Dr. R. K. Sharma', designation: 'Senior Physics Professor', department: 'Science Wing', salary: '₹1,15,000 / mo', leaveBalance: '14 Days', status: 'Active' },
    { id: 2, name: 'Prof. Anjali Mehta', designation: 'Mathematics HOD', department: 'Mathematics Wing', salary: '₹1,30,000 / mo', leaveBalance: '18 Days', status: 'Active' },
    { id: 3, name: 'Mr. Rajesh Nair', designation: 'Hostel Warden & Admin', department: 'Residential Hall', salary: '₹65,000 / mo', leaveBalance: '8 Days', status: 'On Leave' },
    { id: 4, name: 'Mrs. Sunita Rao', designation: 'History & Civics Faculty', department: 'Humanities Wing', salary: '₹85,000 / mo', leaveBalance: '12 Days', status: 'Active' },
  ];

  const handleProcessPayroll = () => {
    setHrSuccess(true);
    setTimeout(() => setHrSuccess(false), 3500);
  };

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-[10px] text-slate-400">Human Resources & Staff Payroll Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">HR, Staff Payroll & Leave Management</h2>
            <p className="text-xs text-slate-400 mt-1">Manage faculty directories, automated salary disbursements, tax withholding, and leave approval workflows.</p>
          </div>
          <button
            onClick={handleProcessPayroll}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <DollarSign className="w-4 h-4" />
            <span>Process Monthly Staff Payroll</span>
          </button>
        </div>

        {hrSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Monthly payroll processed successfully and bank transfer advices dispatched via secure ACH!</span>
          </div>
        )}

        {/* HR KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Total Active Faculty & Staff</div>
            <div className="text-3xl font-extrabold text-white">124 Personnel</div>
            <div className="text-[10px] text-cyan-400 font-medium">100% biometric verified</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Monthly Payroll Disbursed</div>
            <div className="text-3xl font-extrabold text-emerald-400">₹1.18 Cr / mo</div>
            <div className="text-[10px] text-slate-400">Automated tax withholding active</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Pending Leave Requests</div>
            <div className="text-3xl font-extrabold text-amber-400">6 Requests</div>
            <div className="text-[10px] text-slate-400">Awaiting dean review</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Statutory Compliance</div>
            <div className="text-3xl font-extrabold text-emerald-400">Verified</div>
            <div className="text-[10px] text-slate-400">PF, ESI & Professional Tax secure</div>
          </div>
        </div>

        {/* Staff Directory Table */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Institutional Staff & Payroll Roster</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search staff name, designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{staff.name} • <span className="text-cyan-400">{staff.designation}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Department: <strong className="text-slate-300">{staff.department}</strong></span>
                    <span>Salary: <strong className="text-slate-300">{staff.salary}</strong></span>
                    <span>Leave Balance: <strong className="text-emerald-400">{staff.leaveBalance}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    staff.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {staff.status}
                  </span>
                  <button className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-colors cursor-pointer">
                    <Download className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
