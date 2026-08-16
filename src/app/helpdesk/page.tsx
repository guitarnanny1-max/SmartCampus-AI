'use client';

import React, { useState } from 'react';
import { Sparkles, LifeBuoy, Wrench, ArrowLeft, CheckCircle2, Search, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function HelpdeskModule() {
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const ticketList = [
    { id: 1, subject: 'Projector Malfunction in Hall 101', category: 'Hardware/AV', requester: 'Dr. Ramesh Kumar', priority: 'High', status: 'In Progress', sla: '2 hours left' },
    { id: 2, subject: 'Campus Wi-Fi Dropout in Block B', category: 'Network/IT', requester: 'Prof. Anita Desai', priority: 'Urgent', status: 'Open', sla: '45 mins left' },
    { id: 3, subject: 'Lab 402 Workstation Software Update', category: 'Software', requester: 'Dr. B. Patel', priority: 'Medium', status: 'Resolved', sla: 'Completed' },
    { id: 4, subject: 'ID Card Access Reader Repair - Gate 3', category: 'Security Ops', requester: 'Capt. Suresh Rao', priority: 'High', status: 'In Progress', sla: '3 hours left' },
  ];

  const handleCreateTicket = () => {
    setTicketSuccess(true);
    setTimeout(() => setTicketSuccess(false), 3500);
  };

  const filteredTickets = ticketList.filter(item => 
    item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.requester.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampusAI</h1>
            <span className="text-[10px] text-slate-400">Helpdesk & IT Support Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Helpdesk & IT Support Operations</h2>
            <p className="text-xs text-slate-400 mt-1">Manage institutional support tickets, track SLA compliance, and resolve campus infrastructure issues.</p>
          </div>
          <button
            onClick={handleCreateTicket}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Create New Ticket</span>
          </button>
        </div>

        {ticketSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Support ticket logged successfully. Assigned to relevant technical squad with SLA timer started.</span>
          </div>
        )}

        {/* Helpdesk KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Total Active Tickets</div>
            <div className="text-3xl font-extrabold text-white">28</div>
            <div className="text-[10px] text-cyan-400 font-medium">94% resolved within SLA</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">High Priority Issues</div>
            <div className="text-3xl font-extrabold text-rose-400">4</div>
            <div className="text-[10px] text-slate-400">Immediate action required</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Avg Resolution Time</div>
            <div className="text-3xl font-extrabold text-emerald-400">1.8 Hours</div>
            <div className="text-[10px] text-slate-400">-0.4 hrs vs last week</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Satisfaction Score</div>
            <div className="text-3xl font-extrabold text-cyan-400">4.9 / 5.0</div>
            <div className="text-[10px] text-slate-400">Based on user feedback</div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" />
              <span>Support Ticket Queue</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search subject, category, requester..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{ticket.subject} • <span className="text-cyan-400">{ticket.category}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Requester: <strong className="text-slate-300">{ticket.requester}</strong></span>
                    <span>Priority: <strong className={ticket.priority === 'Urgent' || ticket.priority === 'High' ? 'text-rose-400' : 'text-amber-400'}>{ticket.priority}</strong></span>
                    <span>SLA: <strong className="text-slate-300">{ticket.sla}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 
                    ticket.status === 'In Progress' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {ticket.status}
                  </span>
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-400 font-medium transition-colors cursor-pointer">
                    Manage Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampusAI • Enterprise Multi-Tenant Institutional Operating System</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Powered by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
