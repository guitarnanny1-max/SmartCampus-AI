'use client';

import React, { useState } from 'react';
import { 
  Sparkles, Cpu, Users, Building2, Bed, Briefcase, BookOpen, 
  FileText, DollarSign, Bus, Shield, Globe, ArrowRight, CheckCircle2, 
  Activity, Zap, Bell, Search, Lock, RefreshCw 
} from 'lucide-react';
import Link from 'next/link';

export default function MasterDashboard() {
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticComplete, setDiagnosticComplete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRunDiagnostics = () => {
    setDiagnosticRunning(true);
    setDiagnosticComplete(false);
    setTimeout(() => {
      setDiagnosticRunning(false);
      setDiagnosticComplete(true);
      setTimeout(() => setDiagnosticComplete(false), 4000);
    }, 2000);
  };

  const modules = [
    {
      title: 'Smart Energy & IoT Facilities',
      description: 'Solar grid telemetry, HVAC automation, smart water recycling, & IoT sensor mesh.',
      icon: Cpu,
      href: '/facilities',
      badge: 'Operational 99.9%',
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
    },
    {
      title: 'Hostel & Residential Life',
      description: 'Room allocations, digital gate passes, mess menu feedback, & maintenance ticketing.',
      icon: Bed,
      href: '/hostel',
      badge: '96.8% Occupied',
      color: 'from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30'
    },
    {
      title: 'Placement & Career Services',
      description: 'AI resume matching, CTC package tracking, recruitment drives, & interview schedules.',
      icon: Briefcase,
      href: '/placements',
      badge: '98.4% Placed',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      title: 'Library & Digital Resources',
      description: 'RFID book tracking, e-journal subscriptions, AI research citations, & quiet zones.',
      icon: BookOpen,
      href: '/library',
      badge: '1.8M E-Journals',
      color: 'from-blue-500/25 to-cyan-500/25 text-blue-400 border-blue-500/30'
    },
    {
      title: 'Examinations & AI Proctoring',
      description: 'Secure AI proctoring, automated gradebooks, SGPA/CGPA computation, & hall tickets.',
      icon: FileText,
      href: '/examinations',
      badge: 'Zero Malpractice',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30'
    },
    {
      title: 'Finance, Bursar & Fee Collection',
      description: 'Tuition receipt generation, scholarship disbursements, & payment gateway logs.',
      icon: DollarSign,
      href: '/finance',
      badge: '₹ 142.5 Cr Managed',
      color: 'from-emerald-600/20 to-cyan-600/20 text-emerald-400 border-emerald-600/30'
    },
    {
      title: 'Transport & Fleet Management',
      description: 'Real-time GPS bus tracking, EV shuttle dispatch, & smart parking allocations.',
      icon: Bus,
      href: '/transport',
      badge: '42 EV Fleet Active',
      color: 'from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30'
    },
    {
      title: 'Campus Security & Surveillance',
      description: 'AI facial recognition, perimeter intrusion alerts, & emergency SOS dispatch.',
      icon: Shield,
      href: '/security',
      badge: 'Defcon Level 1',
      color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30'
    },
    {
      title: 'Alumni Relations & Networking',
      description: 'Global chapter directories, endowment fund tracking, & mentorship matching.',
      icon: Globe,
      href: '/alumni',
      badge: '45,000+ Alumni',
      color: 'from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30'
    },
  ];

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl shadow-lg shadow-cyan-950">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">SmartCampus AI</h1>
            <span className="text-[11px] text-slate-400 font-medium">www.smartcampusai.in • Enterprise Autonomous Campus Operating System</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleRunDiagnostics}
            disabled={diagnosticRunning}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-cyan-400 flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${diagnosticRunning ? 'animate-spin' : ''}`} />
            <span>{diagnosticRunning ? 'Running AI Diagnostics...' : 'System Diagnostic'}</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>All Systems Optimal</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-10">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden p-8 md:p-12 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 rounded-3xl shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-3 relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs font-semibold text-cyan-300">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Autonomous Higher-Education Intelligence Grid</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              Command & Control Center
            </h2>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Welcome to <strong className="text-white font-semibold">SmartCampus AI</strong> (`www.smartcampusai.in`). Oversee campus energy grids, residential life, career placements, secure examinations, financial bursars, and AI surveillance in real-time.
            </p>
          </div>

          {diagnosticComplete && (
            <div className="p-4 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Full system diagnostic completed! 45,000+ active student records, 1,420 IoT sensors, and financial ledgers verified with 100% data integrity.</span>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800 relative z-10">
            <div className="space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">Enrolled Students</div>
              <div className="text-2xl font-black text-white">18,500+</div>
              <div className="text-[10px] text-emerald-400 font-semibold">+12% YoY enrollment</div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">Campus Solar Offset</div>
              <div className="text-2xl font-black text-emerald-400">2.8 MW/h</div>
              <div className="text-[10px] text-slate-400">Zero-carbon platinum rating</div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">Placement Rate</div>
              <div className="text-2xl font-black text-cyan-400">98.4%</div>
              <div className="text-[10px] text-slate-400">Top-tier corporate offers</div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">Security Surveillance</div>
              <div className="text-2xl font-black text-white">1,420 Cams</div>
              <div className="text-[10px] text-emerald-400 font-semibold">100% active AI telemetry</div>
            </div>
          </div>
        </div>

        {/* Modules Section Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-white">Enterprise Campus Modules</h3>
            <p className="text-xs text-slate-400 mt-0.5">Select a module below to manage telemetry, ledgers, and automated workflows.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search modules (e.g. Finance, Library)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-inner"
            />
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <Link
                key={idx}
                href={mod.href}
                className="group p-6 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-3xl transition-all duration-300 shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between space-y-6 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all pointer-events-none"></div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl border bg-gradient-to-br ${mod.color} shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-bold text-slate-300 group-hover:border-cyan-500/30 transition-colors">
                      {mod.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                      <span>{mod.title}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-cyan-400" />
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{mod.description}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400 relative z-10">
                  <span>Access Module Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/40 px-6 py-8 text-center text-xs text-slate-500 space-y-2 mt-12">
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Autonomous Campus Operating System</p>
        <p className="text-[11px] text-cyan-400/90 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
