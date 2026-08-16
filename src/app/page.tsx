'use client';

import React from 'react';
import { Sparkles, BookOpen, Bus, MessageSquare, Shield, DollarSign, Users, ArrowRight, Activity, CheckCircle2, Building2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function MasterDashboard() {
  const modules = [
    {
      title: 'AI Lesson & Curriculum Planner',
      description: 'Generate CBSE/ICSE aligned lesson plans, learning objectives, and automated MCQ quizzes in seconds.',
      icon: BookOpen,
      href: '/academics',
      badge: 'AI Powered',
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
    },
    {
      title: 'GPS Telemetry & Fleet Tracking',
      description: 'Real-time school bus tracking, live speeds, RFID attendance sync, and parent transit alerts.',
      icon: Bus,
      href: '/transport',
      badge: 'Live GPS',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      title: 'WhatsApp Enterprise Broadcasts',
      description: 'Instant Meta-approved WhatsApp API messaging for fee reminders, attendance alerts, and announcements.',
      icon: MessageSquare,
      href: '/communications',
      badge: 'Cloud API',
      color: 'from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30'
    },
    {
      title: 'Role-Based Access Portals (RBAC)',
      description: 'Customized portals for Administrators, Teachers, Parents, and Students with tailored workflows.',
      icon: Shield,
      href: '/portal',
      badge: 'Secure RBAC',
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30'
    },
    {
      title: 'Fee Management & Finance',
      description: 'Automated quarterly tuition invoicing, secure UPI/card payment gateway, and instant tax receipts.',
      icon: DollarSign,
      href: '/finance',
      badge: 'PCI-DSS',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30'
    },
    {
      title: 'Admissions CRM & Enrollment',
      description: 'Track prospective student inquiries, campus tours, entrance exam scores, and automated lead conversions.',
      icon: Users,
      href: '/admissions',
      badge: 'Pipeline',
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus OS</h1>
            <span className="text-[10px] text-slate-400">Enterprise Institutional Operating System</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> All Systems Operational
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto py-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Delhi Public International Campus Hub
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Next-Generation Educational Management
          </h2>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed">
            Empowering modern schools with AI-driven pedagogy, real-time bus telemetry, WhatsApp communications, and robust financial tracking in a single unified platform.
          </p>
        </div>

        {/* Global Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900/80 border border-slate-800/80 rounded-2xl backdrop-blur-sm space-y-1">
            <div className="text-xs text-slate-400">Active Students</div>
            <div className="text-3xl font-extrabold text-white">2,480</div>
            <div className="text-[10px] text-cyan-400 font-medium">99.8% attendance rate</div>
          </div>
          <div className="p-6 bg-slate-900/80 border border-slate-800/80 rounded-2xl backdrop-blur-sm space-y-1">
            <div className="text-xs text-slate-400">Faculty & Staff</div>
            <div className="text-3xl font-extrabold text-white">142</div>
            <div className="text-[10px] text-cyan-400 font-medium">Payroll fully reconciled</div>
          </div>
          <div className="p-6 bg-slate-900/80 border border-slate-800/80 rounded-2xl backdrop-blur-sm space-y-1">
            <div className="text-xs text-slate-400">Active Bus Fleet</div>
            <div className="text-3xl font-extrabold text-white">24</div>
            <div className="text-[10px] text-cyan-400 font-medium">GPS telemetry online</div>
          </div>
          <div className="p-6 bg-slate-900/80 border border-slate-800/80 rounded-2xl backdrop-blur-sm space-y-1">
            <div className="text-xs text-slate-400">Fee Collection Q2</div>
            <div className="text-3xl font-extrabold text-white">₹1.84 Cr</div>
            <div className="text-[10px] text-cyan-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12.4% YoY
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Platform Modules & Workflows</span>
            </h3>
            <span className="text-xs text-slate-400">Select any module to launch workspace</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={idx}
                  href={mod.href}
                  className="group p-8 bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:shadow-2xl hover:shadow-cyan-950/50 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl border ${mod.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] px-3 py-1 rounded-full font-semibold border ${mod.color}`}>
                        {mod.badge}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                        <span>{mod.title}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-cyan-400" />
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 relative z-10">
                    <span className="group-hover:text-cyan-400 font-semibold transition-colors">Launch Module</span>
                    <span className="font-mono text-[10px] text-slate-500">v2.6 OS</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus OS • Enterprise Educational Infrastructure & Institutional Management</p>
        <p>© 2026 SmartCampus Technologies Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
