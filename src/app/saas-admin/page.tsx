'use client';

import React, { useState } from 'react';
import { Sparkles, Building2, Shield, DollarSign, Activity, ArrowLeft, CheckCircle2, Server, BarChart3, Settings, Users, Plus } from 'lucide-react';
import Link from 'next/link';

export default function SaaSAdminModule() {
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Delhi Public International', plan: 'Enterprise Tier', seats: '142 / 200', mrr: '$1,299', status: 'Active', region: 'Asia-South (Mumbai)' },
    { id: 2, name: 'Metro Global Academy', plan: 'Professional Tier', seats: '88 / 100', mrr: '$799', status: 'Active', region: 'Asia-South (Mumbai)' },
    { id: 3, name: 'St. Xavier Collegiate', plan: 'Starter Tier', seats: '34 / 50', mrr: '$399', status: 'Pending Renewal', region: 'Asia-East (Singapore)' },
  ]);

  const [newOrgName, setNewOrgName] = useState('');
  const [newPlan, setNewPlan] = useState('Professional Tier');
  const [success, setSuccess] = useState(false);

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName) return;

    const newTenantObj = {
      id: tenants.length + 1,
      name: newOrgName,
      plan: newPlan,
      seats: '10 / 50',
      mrr: newPlan.includes('Enterprise') ? '$1,299' : newPlan.includes('Professional') ? '$799' : '$399',
      status: 'Active',
      region: 'Asia-South (Mumbai)'
    };

    setTenants([newTenantObj, ...tenants]);
    setNewOrgName('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus SaaS OS</h1>
            <span className="text-[10px] text-slate-400">Global Super-Admin & Tenant Billing Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/crm" className="flex items-center gap-1.5 text-xs text-cyan-400 hover:underline">
            <span>Switch to CRM</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors pl-3 border-l border-slate-800">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">SaaS Infrastructure & Tenant Management</h2>
            <p className="text-xs text-slate-400 mt-1">Manage all institutional tenants, monitor MRR, configure API rate limits, and provision new client instances.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full w-fit">
            <Server className="w-3.5 h-3.5 animate-pulse" /> Multi-Tenant Cluster Healthy
          </span>
        </div>

        {/* Global SaaS Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Monthly Recurring Revenue (MRR)</div>
            <div className="text-3xl font-extrabold text-white">$2,497 / mo</div>
            <div className="text-[10px] text-cyan-400 font-medium">+22.4% vs last quarter</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Active Institutional Tenants</div>
            <div className="text-3xl font-extrabold text-white">3 Organizations</div>
            <div className="text-[10px] text-cyan-400 font-medium">100% database isolation</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Total Students Managed</div>
            <div className="text-3xl font-extrabold text-white">3,850+</div>
            <div className="text-[10px] text-cyan-400 font-medium">Cross-tenant aggregation</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Global API Gateway Load</div>
            <div className="text-3xl font-extrabold text-cyan-400">14.2 req/s</div>
            <div className="text-[10px] text-slate-400">Latency: 38ms average</div>
          </div>
        </div>

        {/* Provisioning & Tenant List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Provision New Tenant Form */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Provision New Tenant</span>
            </h3>

            {success && (
              <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>New institutional tenant provisioned successfully!</span>
              </div>
            )}

            <form onSubmit={handleAddTenant} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Institution / School Name</label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g., Oakridge International School"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">SaaS Subscription Tier</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option>Starter Tier ($399/mo)</option>
                  <option>Professional Tier ($799/mo)</option>
                  <option>Enterprise Tier ($1,299/mo)</option>
                </select>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-slate-400">Database Schema Allocation</div>
                <div className="font-bold text-white">Dedicated Multi-Tenant Schema</div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <Building2 className="w-4 h-4" />
                <span>Deploy Tenant Instance</span>
              </button>
            </form>
          </div>

          {/* Tenants Management Table */}
          <div className="lg:col-span-2 p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <span>Active Institutional Tenants</span>
              </h3>
              <span className="text-xs text-slate-400">Showing all registered client organizations</span>
            </div>

            <div className="space-y-3 text-xs">
              {tenants.map((tenant) => (
                <div key={tenant.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{tenant.name} <span className="text-cyan-400 font-semibold text-xs">({tenant.plan})</span></div>
                    <div className="text-slate-400 flex items-center gap-4">
                      <span>Seats: <strong className="text-slate-300">{tenant.seats}</strong></span>
                      <span>Region: <strong className="text-slate-300">{tenant.region}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">{tenant.mrr}</span>
                    <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full font-semibold text-[10px]">
                      {tenant.status}
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
