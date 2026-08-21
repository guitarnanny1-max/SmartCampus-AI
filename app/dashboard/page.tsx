'use client';

import { useState } from "react";

export default function SchoolDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 border-b border-slate-800">
            <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-md font-bold border border-indigo-500/20">
              Workspace Tenant
            </span>
            <h2 className="text-lg font-extrabold text-white mt-2">Delhi Public Academy</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">dpsacademy.smartcampus.ai</p>
          </div>

          <nav className="p-4 space-y-1.5 text-xs font-medium">
            <button 
              onClick={() => setActiveTab("overview")} 
              className={`w-full text-left px-4 py-2.5 rounded-xl transition ${activeTab === "overview" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
            >
              📊 Campus Overview
            </button>
            <button 
              onClick={() => setActiveTab("students")} 
              className={`w-full text-left px-4 py-2.5 rounded-xl transition ${activeTab === "students" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
            >
              🎓 Student & Admissions
            </button>
            <button 
              onClick={() => setActiveTab("fees")} 
              className={`w-full text-left px-4 py-2.5 rounded-xl transition ${activeTab === "fees" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
            >
              💳 Fee & Bursar Finance
            </button>
            <button 
              onClick={() => setActiveTab("ai")} 
              className={`w-full text-left px-4 py-2.5 rounded-xl transition ${activeTab === "ai" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
            >
              🤖 AI Campus Copilot
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="text-slate-400">Subscription Plan</div>
            <div className="font-bold text-indigo-400 mt-0.5">School Growth (₹2,999/mo)</div>
            <div className="text-[10px] text-emerald-400 mt-1">● Active & Secure</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Campus Command Center</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time telemetry and administrative control for your institution.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-300 font-medium">
              Academic Year: 2026-2027
            </span>
          </div>
        </div>

        {/* Core KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Students</div>
            <div className="text-3xl font-extrabold text-white mt-2">1,248</div>
            <div className="text-[11px] text-emerald-400 mt-1">+12% enrolled this term</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Fee Collection Rate</div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-2">94.2%</div>
            <div className="text-[11px] text-slate-500 mt-1">₹12.4 Lakhs collected</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Today’s Attendance</div>
            <div className="text-3xl font-extrabold text-indigo-400 mt-2">96.8%</div>
            <div className="text-[11px] text-slate-500 mt-1">1,208 students present</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">AI Copilot Queries</div>
            <div className="text-3xl font-extrabold text-amber-400 mt-2">342</div>
            <div className="text-[11px] text-slate-500 mt-1">Zero latency response</div>
          </div>
        </div>

        {/* Quick Action Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">⚡ Quick Operational Actions</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500 text-slate-300 font-semibold transition text-left">
                + Admit New Student
              </button>
              <button className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500 text-slate-300 font-semibold transition text-left">
                💳 Generate Fee Invoices
              </button>
              <button className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500 text-slate-300 font-semibold transition text-left">
                📢 Broadcast Parent SMS
              </button>
              <button className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500 text-slate-300 font-semibold transition text-left">
                🤖 Launch AI Assistant
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">📋 Recent System Activity</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                <span>Fee payment received from Class 10-B (Aarav Patel)</span>
                <span className="text-emerald-400 font-mono">₹14,500</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                <span>Morning biometric attendance sync completed</span>
                <span className="text-slate-500 font-mono">09:00 AM</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>AI Risk Analysis updated for Grade 12</span>
                <span className="text-indigo-400 font-mono">Just now</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
