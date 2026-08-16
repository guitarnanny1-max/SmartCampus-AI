'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AIChatWidget from '@/components/AIChatWidget';
import { Sparkles, Cpu, Layers, Users, Zap, CheckCircle2, ArrowRight, ShieldCheck, BarChart3, GraduationCap, DollarSign, Send } from 'lucide-react';

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', school: '', email: '', phone: '' });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black relative scroll-smooth">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4" /> Next-Gen School Operating System
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto mb-6 leading-tight">
            SmartCampus AI — 360° School Operating System
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            <strong className="text-slate-200">Let AI help you run your school.</strong> Connect AI, Operations, Academics, Engagement, and School Data into a single intelligent platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#contact" 
              className="w-full sm:w-auto px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-cyan-900/40 text-base"
            >
              Request a Live Demo
            </a>
            <a 
              href="#explorer" 
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold rounded-xl transition-all text-base"
            >
              Explore Platform Interactively
            </a>
          </div>
        </div>
      </section>

      {/* Core Value Proposition Grid */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Built for Modern Educational Institutions</h2>
            <p className="text-slate-400 mt-2 text-sm">Replace fragmented legacy ERPs with unified intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 transition-all">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl w-fit mb-6">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-First Automation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Move beyond static ERPs. Let AI predict student retention risks, recommend staff actions, and automate daily repetitive workflows.
              </p>
            </div>

            <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 transition-all">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl w-fit mb-6">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Unified Operations</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Manage admissions pipelines, fee collection engines, biometric staff HR, and fleet transport from a single cockpit.
              </p>
            </div>

            <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 transition-all">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl w-fit mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Connected Academics & Engagement</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Bridge the communication gap between teachers, students, and parents via native mobile applications and WhatsApp automation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explorer Section */}
      <section id="explorer" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">Platform Modules</span>
          <h2 className="text-3xl font-bold tracking-tight mt-2">Explore the 360° Operating System</h2>
          <p className="text-slate-400 text-sm mt-2">Every tool your school needs, integrated natively into one dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <GraduationCap className="w-8 h-8 text-cyan-400 mb-4" />
            <h4 className="font-bold text-base mb-2">Smart Academics</h4>
            <p className="text-xs text-slate-400">Digital gradebooks, automated report cards, and outcome-based curriculum tracking.</p>
          </div>
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <DollarSign className="w-8 h-8 text-cyan-400 mb-4" />
            <h4 className="font-bold text-base mb-2">Fee Engine</h4>
            <p className="text-xs text-slate-400">Automated recurring fee collection, payment gateway reconciliation, and instant reminders.</p>
          </div>
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <BarChart3 className="w-8 h-8 text-cyan-400 mb-4" />
            <h4 className="font-bold text-base mb-2">Analytics Cockpit</h4>
            <p className="text-xs text-slate-400">Real-time attendance metrics, financial forecasts, and institutional health scorecards.</p>
          </div>
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-cyan-400 mb-4" />
            <h4 className="font-bold text-base mb-2">Secure Portal</h4>
            <p className="text-xs text-slate-400">Role-based access control for administrators, teachers, parents, and students.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">Transparent Pricing</span>
            <h2 className="text-3xl font-bold tracking-tight mt-2">Plans Scaled for Every Institution</h2>
            <p className="text-slate-400 text-sm mt-2">Choose the right tier to transform your campus operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Starter Campus</h3>
                <p className="text-xs text-slate-400 mb-6">Ideal for growing independent schools.</p>
                <div className="text-3xl font-extrabold mb-6">Custom <span className="text-xs font-normal text-slate-400">/ per student</span></div>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Core ERP & Attendance</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Basic Fee Management</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Parent Mobile App</li>
                </ul>
              </div>
              <a href="#contact" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-center font-bold rounded-xl text-xs border border-slate-700 transition-colors">Get Started</a>
            </div>

            <div className="p-8 bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/50 rounded-3xl flex flex-col justify-between relative shadow-2xl shadow-cyan-950/50">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Most Popular</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Professional OS</h3>
                <p className="text-xs text-slate-400 mb-6">For established K-12 schools seeking automation.</p>
                <div className="text-3xl font-extrabold mb-6">All-Inclusive <span className="text-xs font-normal text-slate-400">/ tailored</span></div>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Full AI Command Center</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Admissions CRM & WhatsApp Bot</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Biometric HR & Payroll</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Priority Support & Onboarding</li>
                </ul>
              </div>
              <a href="#contact" className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-center font-bold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-900/50">Request Proposal</a>
            </div>

            <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Enterprise Group</h3>
                <p className="text-xs text-slate-400 mb-6">For multi-campus school chains & universities.</p>
                <div className="text-3xl font-extrabold mb-6">Custom <span className="text-xs font-normal text-slate-400">/ enterprise</span></div>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Multi-Campus Dashboard</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Custom AI Model Fine-tuning</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Dedicated Account Manager</li>
                </ul>
              </div>
              <a href="#contact" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-center font-bold rounded-xl text-xs border border-slate-700 transition-colors">Contact Enterprise</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Demo Request Form Section */}
      <section id="contact" className="py-24 max-w-4xl mx-auto px-6">
        <div className="p-8 sm:p-12 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Ready to Modernize Your Campus?</h2>
            <p className="text-slate-400 text-sm mt-2">Schedule a personalized walkthrough with our educational technology experts.</p>
          </div>

          {formSubmitted ? (
            <div className="p-8 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Demo Request Received!</h3>
              <p className="text-xs text-slate-300">Thank you, {formData.name || 'Principal'}. Our team will reach out to {formData.email || 'your email'} shortly to coordinate your live session.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Dr. Rajesh Sharma" 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">School / Institution Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.school}
                    onChange={(e) => setFormData({...formData, school: e.target.value})}
                    placeholder="Delhi Public International" 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Official Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="principal@school.edu" 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 98765 43210" 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/40 text-sm mt-4 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Submit Demo Request</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Floating Interactive Chatbot Widget */}
      <AIChatWidget />

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-300">SmartCampus AI</span> © 2026 ThomasG Technologies. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="https://www.smartcampusai.in" className="hover:text-cyan-400">www.smartcampusai.in</a>
            <a href="#contact" className="hover:text-cyan-400">Contact Sales</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
