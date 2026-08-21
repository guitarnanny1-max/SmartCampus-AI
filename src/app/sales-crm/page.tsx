export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  DollarSign, 
  PhoneCall, 
  Mail, 
  Calendar, 
  Plus, 
  Search,
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';

export default function SalesCrmPortal() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'leads' | 'analytics'>('pipeline');
  const [leads, setLeads] = useState([
    { id: 1, name: 'Dr. Ahmad Rashid', institution: 'University of Malaya', status: 'Proposal Sent', value: '$12,500', stage: 'Negotiation' },
    { id: 2, name: 'Prof. Sarah Jenkins', institution: 'Monash University Malaysia', status: 'Qualified Lead', value: '$8,000', stage: 'Contacted' },
    { id: 3, name: 'Datuk Seri Lee', institution: 'Taylor’s Education Group', status: 'Closed Won', value: '$35,000', stage: 'Won' },
    { id: 4, name: 'Dr. Marcus Vance', institution: 'Lincoln University College', status: 'New Inquiry', value: '$15,000', stage: 'Lead' }
  ]);

  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadInst, setNewLeadInst] = useState('');
  const [newLeadVal, setNewLeadVal] = useState('');

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) return;
    setLeads([
      ...leads,
      {
        id: leads.length + 1,
        name: newLeadName,
        institution: newLeadInst || 'Independent Researcher',
        status: 'New Inquiry',
        value: newLeadVal ? `$${newLeadVal}` : '$5,000',
        stage: 'Lead'
      }
    ]);
    setNewLeadName('');
    setNewLeadInst('');
    setNewLeadVal('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-full uppercase tracking-widest">
                Commercial Operations
              </span>
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded-full">
                Global SaaS Sales CRM
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Briefcase className="w-10 h-10 text-emerald-400" />
              Sales CRM Dashboard
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm md:text-base">
              Track institutional contracts, manage sales funnels, forecast recurring revenue, and convert prospective academic partners.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">Q3 Pipeline Value</div>
              <div className="text-2xl font-bold text-white">$70,500</div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-mono">Total Deals</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white">24 Active Accounts</div>
            <div className="text-xs text-emerald-400 mt-1">+4 added this week</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-mono">Conversion Rate</span>
              <Award className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white">68.4%</div>
            <div className="text-xs text-emerald-400 mt-1">Above industry average</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-mono">Closed Revenue</span>
              <DollarSign className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-bold text-white">$35,000</div>
            <div className="text-xs text-emerald-400 mt-1">Secured this quarter</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-mono">Avg Deal Cycle</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white">14 Days</div>
            <div className="text-xs text-slate-400 mt-1">Fast-track processing</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'pipeline' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400'}`}
          >
            Sales Pipeline Kanban
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'leads' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400'}`}
          >
            Lead Directory & Add Lead
          </button>
        </div>

        {/* Tab: Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Lead', 'Contacted', 'Negotiation', 'Won'].map((stageName, sIdx) => (
              <div key={sIdx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-sm">{stageName}</h4>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-[10px] rounded-full">
                    {leads.filter((l: any) => l.stage === stageName).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {leads.filter((l: any) => l.stage === stageName).map((lead: any) => (
                    <div key={lead.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <div className="font-bold text-white text-sm">{lead.name}</div>
                      <div className="text-xs text-slate-400">{lead.institution}</div>
                      <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-xs font-mono">
                        <span className="text-emerald-400 font-bold">{lead.value}</span>
                        <span className="text-slate-500">{lead.status}</span>
                      </div>
                    </div>
                  ))}
                  {leads.filter((l: any) => l.stage === stageName).length === 0 && (
                    <div className="text-xs text-slate-500 italic p-2 text-center">No accounts in this stage</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Leads & Add Lead */}
        {activeTab === 'leads' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 lg:col-span-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Add New Institutional Lead
              </h3>
              <form onSubmit={handleAddLead} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 uppercase font-mono">Client Full Name</label>
                  <input
                    type="text"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    placeholder="e.g. Dr. John Doe"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 uppercase font-mono">Institution / Organization</label>
                  <input
                    type="text"
                    value={newLeadInst}
                    onChange={(e) => setNewLeadInst(e.target.value)}
                    placeholder="e.g. University of Technology"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 uppercase font-mono">Estimated Contract Value ($)</label>
                  <input
                    type="text"
                    value={newLeadVal}
                    onChange={(e) => setNewLeadVal(e.target.value)}
                    placeholder="e.g. 10000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
                >
                  Save Lead to CRM
                </button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 lg:col-span-2">
              <h3 className="text-lg font-bold text-white">Active Client Directory</h3>
              <div className="space-y-3">
                {leads.map((lead: any) => (
                  <div key={lead.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{lead.name}</div>
                      <div className="text-xs text-slate-400">{lead.institution}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-emerald-400 text-sm">{lead.value}</span>
                      <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs rounded-full">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
