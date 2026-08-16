'use client';

import React, { useState } from 'react';
import { Sparkles, ShieldCheck, FileText, Search, ArrowLeft, AlertCircle, CheckCircle2, Lock, Terminal, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AuditLogsModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');

  const logs = [
    { id: 1, event: 'TENANT_CONFIG_UPDATED', user: 'admin@delhipublic.edu.in', tenant: 'Delhi Public International', ip: '152.57.19.22', severity: 'Info', time: '12 mins ago' },
    { id: 2, event: 'API_SECRET_KEY_ROTATED', user: 'superadmin@smartcampus.io', tenant: 'Global SaaS Admin', ip: '203.0.113.42', severity: 'Warning', time: '45 mins ago' },
    { id: 3, event: 'BULK_LEAD_EXPORT', user: 'sales@metroglobal.edu.in', tenant: 'Metro Global Academy', ip: '103.21.244.11', severity: 'Info', time: '2 hours ago' },
    { id: 4, event: 'FAILED_LOGIN_ATTEMPT', user: 'unknown@external.net', tenant: 'St. Xavier Collegiate', ip: '45.141.58.9', severity: 'Critical', time: '3 hours ago' },
    { id: 5, event: 'PAYMENT_GATEWAY_RECONCILED', user: 'finance@delhipublic.edu.in', tenant: 'Delhi Public International', ip: '152.57.19.88', severity: 'Info', time: '5 hours ago' },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.event.toLowerCase().includes(searchTerm.toLowerCase()) || log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

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
            <span className="text-[10px] text-slate-400">Enterprise Audit Logs & Compliance Center</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Security & Compliance Audit Trail</h2>
            <p className="text-xs text-slate-400 mt-1">Immutable, real-time logging of all administrative actions, data exports, and security events across tenants.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full w-fit">
            <ShieldCheck className="w-3.5 h-3.5" /> SOC-2 & GDPR Compliant
          </span>
        </div>

        {/* Security KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Total Audit Events (24h)</div>
            <div className="text-3xl font-extrabold text-white">1,482</div>
            <div className="text-[10px] text-cyan-400 font-medium">Zero anomalous tampering</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Security Threats Blocked</div>
            <div className="text-3xl font-extrabold text-emerald-400">14 IPs</div>
            <div className="text-[10px] text-slate-400">Automated rate-limiting active</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Compliance Status</div>
            <div className="text-3xl font-extrabold text-white">99.9%</div>
            <div className="text-[10px] text-cyan-400 font-medium">All tenants fully isolated</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Log Retention Period</div>
            <div className="text-3xl font-extrabold text-white">7 Years</div>
            <div className="text-[10px] text-slate-400">Encrypted cold storage vault</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search event name or user email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs">
              <span className="text-slate-400">Severity Filter:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none cursor-pointer"
              >
                <option value="All">All Severities</option>
                <option value="Info">Info</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="space-y-3 text-xs">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No audit logs matching your search criteria.</div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono text-sm">{log.event}</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        log.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                        log.severity === 'Warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {log.severity}
                      </span>
                    </div>
                    <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                      <span>User: <strong className="text-slate-300">{log.user}</strong></span>
                      <span>Tenant: <strong className="text-slate-300">{log.tenant}</strong></span>
                      <span>IP: <strong className="text-slate-300 font-mono">{log.ip}</strong></span>
                    </div>
                  </div>
                  <div className="text-slate-500 text-[11px] font-mono shrink-0">
                    {log.time}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
