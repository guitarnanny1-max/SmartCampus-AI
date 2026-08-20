'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SmartCampusAIPortal() {
  const [demoForm, setDemoForm] = useState({ institutionName: '', contactName: '', email: '', phone: '', studentCount: '5,000+' });
  const [submitted, setSubmitted] = useState(false);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 shadow-lg shadow-emerald-500/20 text-lg">
              S
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-white">SmartCampus AI</h2>
              <p className="text-[10px] text-slate-400 font-medium">Institutional Operating System</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#modules" className="hover:text-white transition">Modules</a>
            <a href="#features" className="hover:text-white transition">Capabilities</a>
            <a href="#logins" className="hover:text-white transition">Campus Portals</a>
            <a href="#demo" className="hover:text-white transition">Request Demo</a>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="#demo" 
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              Book Sales Demo
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-20 pb-28 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/30 via-slate-950/0 to-slate-950/0 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
            <span>✨</span> NEXT-GEN INSTITUTIONAL AI PLATFORM 2026
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            The Complete Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Modern Universities & Schools</span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-normal">
            Automate subscriptions, track faculty health, integrate open-source LMS, manage visiting scholars, and celebrate national milestones with enterprise-grade precision.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a 
              href="#logins" 
              className="px-6 py-3.5 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-xs transition-all shadow-xl"
            >
              Access Campus Logins ↗
            </a>
            <a 
              href="#demo" 
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
            >
              Schedule Institutional Demo
            </a>
          </div>
        </div>
      </header>

      {/* Campus Login Quick Access Section */}
      <section id="logins" className="py-16 px-6 bg-slate-900/30 border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Single Sign-On & Portal Access</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Campus Login Gateways</h2>
            <p className="text-xs text-slate-400">Select your institutional role to securely access your dedicated workspace.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            <Link href="/smart-staff-health" className="group bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all space-y-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                🎓
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Student Portal</h3>
                <p className="text-[11px] text-slate-400 mt-1">Access courses, SCORM modules, and campus calendar.</p>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold pt-2">Login as Student →</div>
            </Link>

            <Link href="/smart-staff-health" className="group bg-slate-950 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 transition-all space-y-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                👨‍🏫
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Faculty Portal</h3>
                <p className="text-[11px] text-slate-400 mt-1">Manage classes, health step sync, and visiting schedules.</p>
              </div>
              <div className="text-[10px] text-teal-400 font-semibold pt-2">Login as Faculty →</div>
            </Link>

            <Link href="/platform-utilization" className="group bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all space-y-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Admin Dashboard</h3>
                <p className="text-[11px] text-slate-400 mt-1">Monitor platform utilization, subscriptions, and metrics.</p>
              </div>
              <div className="text-[10px] text-blue-400 font-semibold pt-2">Login as Administrator →</div>
            </Link>

            <Link href="/smart-feature-toggle" className="group bg-slate-950 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-6 transition-all space-y-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Super Admin</h3>
                <p className="text-[11px] text-slate-400 mt-1">Enable/disable features and configure webhooks globally.</p>
              </div>
              <div className="text-[10px] text-rose-400 font-semibold pt-2">Super Admin Access →</div>
            </Link>

          </div>
        </div>
      </section>

      {/* Modules & Capabilities Hub */}
      <section id="modules" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Ecosystem Modules</span>
          <h2 className="text-3xl font-extrabold text-white">Integrated Institutional Features</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">All modules are fully operational, tested with Prisma ORM, and instantly toggleable by Super Admins.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Billing & Webhooks
            </span>
            <h3 className="text-base font-bold text-white">Auto-Extension on Payment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seamlessly capture Stripe and Razorpay webhooks to instantly renew institutional subscriptions and generate audit logs.
            </p>
            <Link href="/smart-payment-extension" className="inline-block text-xs font-semibold text-emerald-400 hover:underline">
              Open Payment Hub →
            </Link>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              Faculty Management
            </span>
            <h3 className="text-base font-bold text-white">Visiting & Adjunct Professors</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage international guest lecturers, research collaborators, home institutions, and semester teaching schedules.
            </p>
            <Link href="/smart-visiting-faculty" className="inline-block text-xs font-semibold text-indigo-400 hover:underline">
              Open Visiting Faculty Hub →
            </Link>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              National & Cultural 🇮🇳
            </span>
            <h3 className="text-base font-bold text-white">India Day-Wise Celebrations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated reminders and assembly broadcasts for Independence Day, Republic Day, Teacher&apos;s Day, Gandhi Jayanti, and more.
            </p>
            <Link href="/smart-india-celebrations" className="inline-block text-xs font-semibold text-amber-400 hover:underline">
              Open India Celebrations Hub →
            </Link>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
              Staff Wellness 👟
            </span>
            <h3 className="text-base font-bold text-white">Health Monitoring & Walking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mobile pedometer step sync, walking distance calculations, heart rate averages, social media IDs, and insurance suggestions.
            </p>
            <Link href="/smart-staff-health" className="inline-block text-xs font-semibold text-teal-400 hover:underline">
              Open Staff Health Hub →
            </Link>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Open-Source LMS 🌐
            </span>
            <h3 className="text-base font-bold text-white">LMS Enhancement & SCORM</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrate Moodle plugins, Canvas LTI connectors, Rust SCORM parsers, and open-source AI tutoring repositories.
            </p>
            <Link href="/smart-lms-opensource" className="inline-block text-xs font-semibold text-blue-400 hover:underline">
              Open LMS Utilization Hub →
            </Link>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
              Analytics & Control 📊
            </span>
            <h3 className="text-base font-bold text-white">Utilization & Super Admin</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track top platform utilization across schools and instantly toggle features on or off with the Super Admin panel.
            </p>
            <div className="flex gap-4 pt-1">
              <Link href="/platform-utilization" className="text-xs font-semibold text-purple-400 hover:underline">Analytics ↗</Link>
              <Link href="/smart-feature-toggle" className="text-xs font-semibold text-rose-400 hover:underline">Toggles ↗</Link>
            </div>
          </div>

        </div>
      </section>

      {/* Sales / Demo Lead Form Section */}
      <section id="demo" className="py-20 px-6 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-3xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden space-y-8">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              INSTITUTIONAL SALES & DEMO
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Experience SmartCampus AI Live</h2>
            <p className="text-xs text-slate-400">Schedule a personalized walkthrough with our educational technology specialists for your university or school board.</p>
          </div>

          {submitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-2">
              <h3 className="text-lg font-bold text-emerald-400">Demo Request Received!</h3>
              <p className="text-xs text-slate-300">Our institutional sales team will contact you within 2 business hours to coordinate your live demo.</p>
            </div>
          ) : (
            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400">Institution / University Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Stanford University" 
                    required 
                    value={demoForm.institutionName}
                    onChange={e => setDemoForm({ ...demoForm, institutionName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400">Contact Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dr. Robert Langdon" 
                    required 
                    value={demoForm.contactName}
                    onChange={e => setDemoForm({ ...demoForm, contactName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400">Institutional Email</label>
                  <input 
                    type="email" 
                    placeholder="e.g. rlangdon@university.edu" 
                    required 
                    value={demoForm.email}
                    onChange={e => setDemoForm({ ...demoForm, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. +1 (555) 019-2834" 
                    required 
                    value={demoForm.phone}
                    onChange={e => setDemoForm({ ...demoForm, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400">Total Student Enrollment</label>
                <select 
                  value={demoForm.studentCount}
                  onChange={e => setDemoForm({ ...demoForm, studentCount: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Under 1,000">Under 1,000 Students</option>
                  <option value="1,000 - 5,000">1,000 - 5,000 Students</option>
                  <option value="5,000 - 20,000">5,000 - 20,000 Students</option>
                  <option value="20,000+">20,000+ Students (Enterprise)</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20"
                >
                  Request Sales Walkthrough & Live Demo →
                </button>
              </div>
            </form>
          )}

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-6 text-center text-xs text-slate-500 space-y-2">
        <p>© 2026 SmartCampus AI Inc. All rights reserved. Empowering global educational excellence.</p>
        <p className="text-slate-600">Secure Prisma ORM Backend • Stripe & Razorpay Webhooks • SCORM/xAPI Compliant</p>
      </footer>

    </div>
  );
}
