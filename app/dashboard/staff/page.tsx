'use client';

import { useState } from "react";

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState([
    { id: "STF-001", name: "Dr. Rajesh Sharma", role: "Principal", department: "Administration", phone: "+91 98111 00001", status: "Present", shift: "Morning" },
    { id: "STF-002", name: "Priya Mehta", role: "Senior Mathematics Teacher", department: "Academics (Grades 9-12)", phone: "+91 98222 11112", status: "Present", shift: "Morning" },
    { id: "STF-003", name: "Amit Verma", role: "Physics Faculty & Lab Head", department: "Science Department", phone: "+91 98333 22223", status: "On Leave", shift: "Morning" },
    { id: "STF-004", name: "Sunita Rao", role: "Head Librarian", department: "Library & Information", phone: "+91 98444 33334", status: "Present", shift: "Full Day" },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full font-semibold border border-indigo-500/20">
            Workforce & Payroll Operations
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Staff & HR Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage faculty directories, department assignments, attendance tracking, and payroll schedules.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow">
          + Onboard New Staff
        </button>
      </div>

      {/* HR KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Active Staff</div>
          <div className="text-3xl font-extrabold text-white mt-2">84 Faculty</div>
          <div className="text-[11px] text-emerald-400 mt-1">100% biometric verified</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Staff Present Today</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">81 / 84</div>
          <div className="text-[11px] text-slate-500 mt-1">96.4% attendance rate</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Student-Teacher Ratio</div>
          <div className="text-3xl font-extrabold text-indigo-400 mt-2">14.8 : 1</div>
          <div className="text-[11px] text-slate-500 mt-1">Optimal board compliance</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Monthly Payroll</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">₹42.5 Lakhs</div>
          <div className="text-[11px] text-slate-500 mt-1">Processed for August 2026</div>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200">
          Faculty & Administrative Directory
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Staff ID</th>
                <th className="px-6 py-3 font-semibold">Full Name</th>
                <th className="px-6 py-3 font-semibold">Designation</th>
                <th className="px-6 py-3 font-semibold">Department</th>
                <th className="px-6 py-3 font-semibold">Phone Number</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {staffList.map((stf: any) => (
                <tr key={stf.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono font-bold text-indigo-400">{stf.id}</td>
                  <td className="px-6 py-4 font-bold text-white">{stf.name}</td>
                  <td className="px-6 py-4 text-slate-300">{stf.role}</td>
                  <td className="px-6 py-4 text-slate-300">{stf.department}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">{stf.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      stf.status === "Present" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {stf.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-slate-400 hover:text-white font-medium">Profile</button>
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">Payroll</button>
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
