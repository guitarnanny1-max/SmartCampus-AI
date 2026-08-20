'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Activity, 
  AlertTriangle, 
  UserPlus, 
  Settings, 
  Server, 
  Search, 
  ChevronRight,
  Database,
  Bell
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats] = useState([
    { label: 'Total Enrollment', value: '1,248', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Faculty Count', value: '84', icon: Building2, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'System Uptime', value: '99.98%', icon: Server, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Alerts', value: '3', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' }
  ]);

  const [logs] = useState([
    { id: 1, action: 'User Login', target: 'Finance Dept', time: '10m ago', status: 'Success' },
    { id: 2, action: 'Exam Schedule', target: 'Grade 11', time: '1h ago', status: 'Update' },
    { id: 3, action: 'Fee Settlement', target: 'Aarav Sharma', time: '2h ago', status: 'Success' },
    { id: 4, action: 'Facility Check', target: 'Room 302', time: '3h ago', status: 'Warning' }
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono rounded-full uppercase">
                Portal: System Administration
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">Institutional Operations Hub 🏛️</h1>
            <p className="text-slate-400 text-sm">Delhi Public School • IT & Admin Console</p>
          </div>
          <div className="flex gap-3">
             <Link href="/dashboard" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-colors">
                Master Hub
             </Link>
             <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-semibold text-white transition-colors">
                System Restart
             </button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-mono">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Activity Logs */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              System Activity Feed
            </h2>
            <div className="space-y-3">
              {logs.map(log => (
                <div key={log.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${log.status === 'Success' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-200">{log.action}</h3>
                      <p className="text-xs text-slate-500 font-mono">Target: {log.target}</p>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-slate-400">{log.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                Admin Controls
              </h2>
              <div className="space-y-3">
                <button className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-left text-sm font-semibold hover:border-cyan-500 transition-colors flex items-center justify-between group">
                  Manage Faculty Records <UserPlus className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                </button>
                <button className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-left text-sm font-semibold hover:border-cyan-500 transition-colors flex items-center justify-between group">
                  Update Infrastructure <Database className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                </button>
                <button className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-left text-sm font-semibold hover:border-cyan-500 transition-colors flex items-center justify-between group">
                  System Alerts Settings <Bell className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/20 p-6 rounded-2xl text-center">
              <ShieldCheck className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
              <h3 className="font-bold text-white">Security Scan</h3>
              <p className="text-xs text-slate-400 mt-2 mb-4">Last scan: 2 hours ago. All systems secure.</p>
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold transition-all">
                Run Diagnostics
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
