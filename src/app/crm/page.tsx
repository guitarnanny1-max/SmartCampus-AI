export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { Sparkles, Users, Building2, Phone, Mail, DollarSign, Shield, Filter, Plus, CheckCircle2, ArrowLeft, TrendingUp, Briefcase, Globe } from 'lucide-react';
import Link from 'next/link';

export default function CRMDashboardModule() {
  // Multi-tenant and Role state simulation
  const [tenant, setTenant] = useState('Delhi Public International');
  const [userRole, setUserRole] = useState<'sales_exec' | 'crm_manager' | 'tenant_admin'>('crm_manager');

  const [leads, setLeads] = useState([
    { id: 1, name: 'Aarav Sharma', school: 'Delhi Public International', grade: 'Grade 11 Science', status: 'Campus Tour Booked', value: '₹1.8L / yr', owner: 'Ramesh Kumar' },
    { id: 2, name: 'Sanya Malhotra', school: 'Delhi Public International', grade: 'Grade 9', status: 'Document Verification', value: '₹1.5L / yr', owner: 'Pooja Verma' },
    { id: 3, name: 'Kabir Mehta', school: 'Metro Global Academy', grade: 'Grade 6', status: 'Enrolled & Paid', value: '₹1.4L / yr', owner: 'Ramesh Kumar' },
  ]);

  // Filter leads based on tenant selection
  const filteredLeads = leads.filter((l: any) => tenant === 'All Tenants' || l.school === tenant);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header with Multi-Tenant & Role Switcher */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus SaaS</h1>
              <span className="text-[10px] text-slate-400">Multi-Tenant CRM & Admissions OS</span>
            </div>
          </div>

          <Link href="/" className="md:hidden flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>

        {/* Tenant & Role Selectors (SaaS Simulation Controls) */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap text-xs">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="Delhi Public International">Tenant: Delhi Public Intl</option>
              <option value="Metro Global Academy">Tenant: Metro Global Academy</option>
              <option value="All Tenants">All Tenants (Super Admin)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="sales_exec">Role: Sales Executive</option>
              <option value="crm_manager">Role: CRM Manager</option>
              <option value="tenant_admin">Role: Tenant Admin</option>
            </select>
          </div>

          <Link href="/" className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors pl-2 border-l border-slate-800">
            <ArrowLeft className="w-4 h-4" />
            <span>Exit CRM</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">CRM Dashboard • {tenant}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Logged in as <span className="text-cyan-400 font-semibold uppercase">{userRole.replace('_', ' ')}</span> with scoped tenant permissions.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full w-fit">
            <Globe className="w-3.5 h-3.5" /> Multi-Tenant Isolation Active
          </span>
        </div>

        {/* Dynamic Metrics Row based on Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Pipeline Inquiries</div>
            <div className="text-3xl font-extrabold text-white">{filteredLeads.length * 48}</div>
            <div className="text-[10px] text-cyan-400 font-medium">+18.2% this month</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Projected Annual Value</div>
            <div className="text-3xl font-extrabold text-white">₹42.5 Lakhs</div>
            <div className="text-[10px] text-cyan-400 font-medium">Based on active pipeline</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Conversion Rate</div>
            <div className="text-3xl font-extrabold text-white">58.4%</div>
            <div className="text-[10px] text-cyan-400 font-medium">Automated WhatsApp triggers</div>
          </div>
          {userRole === 'tenant_admin' ? (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
              <div className="text-xs text-slate-400">SaaS Seat Utilization</div>
              <div className="text-3xl font-extrabold text-cyan-400">142 / 200</div>
              <div className="text-[10px] text-slate-400">Tier: Enterprise Multi-Tenant</div>
            </div>
          ) : (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
              <div className="text-xs text-slate-400">Assigned Follow-ups</div>
              <div className="text-3xl font-extrabold text-amber-400">12 Pending</div>
              <div className="text-[10px] text-slate-400">Due before 05:00 PM</div>
            </div>
          )}
        </div>

        {/* Role-Specific CRM Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions / Role Specific Panel */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>{userRole === 'tenant_admin' ? 'Tenant Administration' : userRole === 'crm_manager' ? 'CRM Team Overview' : 'Sales Executive Actions'}</span>
            </h3>

            {userRole === 'tenant_admin' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                  <div className="font-bold text-white">Billing & Subscription</div>
                  <div className="text-slate-400">Active Plan: Enterprise Tier ($499/mo)</div>
                  <button onClick={() => alert('Subscription management portal opened.')} className="text-cyan-400 hover:underline pt-1 block">Manage Billing & Invoices →</button>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                  <div className="font-bold text-white">Staff Permission Matrix</div>
                  <div className="text-slate-400">14 Active Staff Accounts in {tenant}</div>
                  <button onClick={() => alert('RBAC permission settings updated.')} className="text-cyan-400 hover:underline pt-1 block">Configure Roles & Access →</button>
                </div>
              </div>
            )}

            {userRole === 'crm_manager' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="font-bold text-white">Lead Assignment Rules</div>
                  <p className="text-slate-400">Automatic round-robin assignment enabled for inbound WhatsApp & Web inquiries.</p>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="font-bold text-white">Team Performance</div>
                  <p className="text-slate-400">Ramesh Kumar leads conversion by +24% this week across {tenant}.</p>
                </div>
              </div>
            )}

            {userRole === 'sales_exec' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="font-bold text-white">My Daily Call List</div>
                  <p className="text-slate-400">You have 12 parent follow-up calls scheduled for today.</p>
                  <button onClick={() => alert('Dialer initialized for next lead.')} className="w-full mt-2 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all text-center block">
                    Start Auto-Dialer Queue
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lead Pipeline Table */}
          <div className="lg:col-span-2 p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Tenant Pipeline Leads ({tenant})</span>
              </h3>
              <span className="text-xs text-slate-400">{filteredLeads.length} active leads</span>
            </div>

            <div className="space-y-3 text-xs">
              {filteredLeads.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No leads found for this tenant selection.</div>
              ) : (
                filteredLeads.map((lead: any) => (
                  <div key={lead.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-white text-sm">{lead.name} <span className="text-slate-400 font-normal text-xs">({lead.grade})</span></div>
                      <div className="text-slate-400 flex items-center gap-3">
                        <span>Assigned to: <strong className="text-slate-300">{lead.owner}</strong></span>
                        <span>Value: <strong className="text-cyan-400">{lead.value}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full font-semibold text-[10px]">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
