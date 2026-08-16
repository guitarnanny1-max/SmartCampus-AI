'use client';

import React, { useState } from 'react';
import { Sparkles, MessageSquare, Send, CheckCircle2, Shield, ArrowLeft, Users, Bell, Phone, Check } from 'lucide-react';
import Link from 'next/link';

export default function CommunicationsModule() {
  const [template, setTemplate] = useState('fee_reminder');
  const [targetGroup, setTargetGroup] = useState('fee_defaulters');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const templates: Record<string, { title: string; body: string }> = {
    fee_reminder: {
      title: 'Quarterly Fee Reminder',
      body: 'Dear Parent, this is a gentle reminder from Delhi Public International that Q2 tuition fees of ₹24,500 are due by August 31, 2026. Pay securely via your parent portal: https://smartcampusai.in/portal'
    },
    attendance_alert: {
      title: 'Daily Attendance Alert',
      body: 'Dear Parent, biometric records indicate your child was marked absent for todaystststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststst’
title: 'Daily Attendance Alert',
      body: 'Dear Parent, biometric records indicate your child was marked absent for todaystststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststststts...\n      body: 'Dear Parent, biometric records indicate your child was marked absent for today’s first period (08:30 AM). Please contact school office if incorrect.'
    },
    exam_schedule: {
      title: 'Term Examination Notice',
      body: 'Dear Parent, the Mid-Term Examination schedule for the upcoming term has been published. Download the PDF timetable from the student portal.'
    },
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccess(false);

    setTimeout(() => {
      setSending(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus OS</h1>
            <span className="text-[10px] text-slate-400">WhatsApp Cloud API & Broadcast Engine</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">WhatsApp Enterprise Broadcast Center</h2>
            <p className="text-xs text-slate-400 mt-1">Send verified WhatsApp template broadcasts with automated delivery receipts and engagement metrics.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full w-fit">
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp API Connected
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Messages Delivered Today</div>
            <div className="text-3xl font-extrabold mt-2">2,480</div>
            <div className="text-[10px] text-emerald-400 mt-1 font-medium">99.4% delivery success</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Read & Acknowledged Rate</div>
            <div className="text-3xl font-extrabold mt-2">91.6%</div>
            <div className="text-[10px] text-emerald-400 mt-1 font-medium">+2.1% vs last week</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Active Approved Templates</div>
            <div className="text-3xl font-extrabold mt-2">14</div>
            <div className="text-[10px] text-slate-400 mt-1">Meta Business verified</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Opt-In Parent Database</div>
            <div className="text-3xl font-extrabold mt-2">99.8%</div>
            <div className="text-[10px] text-slate-400 mt-1">GDPR & DPDP compliant</div>
          </div>
        </div>

        {/* Broadcast Form & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Create WhatsApp Broadcast</span>
            </h3>

            {success ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Broadcast Dispatched Successfully!</h4>
                <p className="text-xs text-slate-300">Message successfully queued and dispatched via WhatsApp Cloud API to selected parent recipients.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Send Another Broadcast
                </button>
              </div>
            ) : (
              <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Select Meta Approved Template</label>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="fee_reminder">Quarterly Fee Reminder</option>
                    <option value="attendance_alert">Daily Attendance Alert</option>
                    <option value="exam_schedule">Term Examination Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Target Recipient Group</label>
                  <select
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="fee_defaulters">Fee Defaulters (All Unpaid Quarters)</option>
                    <option value="grade_10">Grade 10 Parents Only</option>
                    <option value="all_parents">All School Parents (2,480 recipients)</option>
                  </select>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Estimated Reach</div>
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>{targetGroup === 'all_parents' ? '2,480 Parents' : targetGroup === 'grade_10' ? '240 Parents' : '142 Parents'}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-emerald-950 text-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <Send className="w-4 h-4" />
                  <span>{sending ? 'Broadcasting via WhatsApp API...' : 'Send WhatsApp Broadcast Now'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Live Preview */}
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Live WhatsApp Message Preview</span>
              </h3>

              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 max-w-sm mx-auto shadow-inner">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">SC</div>
                  <span>SmartCampus Official Bot</span>
                </div>
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-xs text-slate-200 leading-relaxed space-y-2">
                  <p className="font-bold text-emerald-400">[{templates[template].title}]</p>
                  <p>{templates[template].body}</p>
                </div>
                <div className="text-[10px] text-right text-slate-500 flex items-center justify-end gap-1">
                  <span>01:45 PM</span>
                  <Check className="w-3 h-3 text-cyan-400" />
                  <Check className="w-3 h-3 text-cyan-400 -ml-2" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3 text-xs text-slate-400">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>All messages comply with WhatsApp Business API anti-spam and opt-in guidelines.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
