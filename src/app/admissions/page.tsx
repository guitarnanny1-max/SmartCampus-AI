'use client';

import React, { useState } from 'react';
import { Sparkles, Users, UserPlus, Calendar, CheckCircle2, ArrowLeft, Phone, Mail, Shield, Filter, Award } from 'lucide-react';
import Link from 'next/link';

export default function AdmissionsModule() {
  const [inquiries, setInquiries] = useState([
    { id: 1, name: 'Rohan Verma', grade: 'Grade 11 Science', parent: 'Alok Verma', phone: '+91 98991 12233', status: 'Campus Tour Scheduled', score: '94% (Entrance)' },
    { id: 2, name: 'Sanya Malhotra', grade: 'Grade 9', parent: 'Pooja Malhotra', phone: '+91 98222 44556', status: 'Document Verification', score: '88% (Entrance)' },
    { id: 3, name: 'Kabir Mehta', grade: 'Grade 6', parent: 'Vikram Mehta', phone: '+91 98333 77889', status: 'Enrolled & Fee Paid', score: '96% (Entrance)' },
  ]);

  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadGrade, setNewLeadGrade] = useState('Grade 10');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) return;

    const newLead = {
      id: inquiries.length + 1,
      name: newLeadName,
      grade: newLeadGrade,
      parent: 'Guardian',
      phone: newLeadPhone,
      status: 'New Inquiry',
      score: 'Pending Test',
    };

    setInquiries([newLead, ...inquiries]);
    setNewLeadName('');
    setNewLeadPhone('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
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
            <span className="text-[10px] text-slate-400">Admissions CRM & Enrollment Pipeline</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Institutional Admissions CRM</h2>
            <p className="text-xs text-slate-400 mt-1">Track prospective student leads, entrance exam scores, campus tours, and automated enrollment workflows.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full w-fit">
            <Users className="w-3.5 h-3.5" /> CRM Pipeline Active
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Total Active Inquiries</div>
            <div className="text-3xl font-extrabold mt-2 text-white">384</div>
            <div className="text-[10px] text-cyan-400 mt-1">+24% vs last academic year</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Campus Tours Booked</div>
            <div className="text-3xl font-extrabold mt-2 text-white">48</div>
            <div className="text-[10px] text-cyan-400 mt-1">Scheduled for this week</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Entrance Test Cleared</div>
            <div className="text-3xl font-extrabold mt-2 text-cyan-400">210</div>
            <div className="text-[10px] text-slate-400 mt-1">Average score: 89.2%</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Conversion Rate</div>
            <div className="text-3xl font-extrabold mt-2 text-white">54.6%</div>
            <div className="text-[10px] text-cyan-400 mt-1">Automated WhatsApp followups</div>
          </div>
        </div>

        {/* CRM Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Lead Form */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>Add Prospective Lead</span>
            </h3>

            {successMsg && (
              <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>New lead added successfully to CRM pipeline!</span>
              </div>
            )}

            <form onSubmit={handleAddLead} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="e.g., Aarav Sharma"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Target Grade</label>
                <select
                  value={newLeadGrade}
                  onChange={(e) => setNewLeadGrade(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option>Grade 8</option>
                  <option>Grade 9</option>
                  <option>Grade 10</option>
                  <option>Grade 11 Science</option>
                  <option>Grade 12 Science</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Guardian Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  placeholder="+91 98000 11223"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Prospect Lead</span>
              </button>
            </form>
          </div>

          {/* Inquiries Pipeline Table */}
          <div className="lg:col-span-2 p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Recent Inquiries Pipeline</span>
              </h3>
              <span className="text-xs text-slate-400">Showing latest active prospects</span>
            </div>

            <div className="space-y-3 text-xs">
              {inquiries.map((lead) => (
                <div key={lead.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{lead.name} <span className="text-slate-400 font-normal text-xs">({lead.grade})</span></div>
                    <div className="text-slate-400 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-cyan-400" /> {lead.phone}</span>
                      <span className="flex items-center gap-1"><Award className="w-3 h-3 text-cyan-400" /> {lead.score}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full font-semibold text-[10px] ${
                      lead.status.includes('Enrolled') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
