'use client';

import { useState, useEffect } from "react";

export default function TelemetryDashboardPage() {
  const [metrics, setMetrics] = useState({
    uptime: "99.99%",
    avgResponseTime: "42ms",
    activeRequests: 1420,
    errorRate: "0.01%",
    databaseConnections: 38,
    redisMemory: "124 MB"
  });

  const [logs] = useState([
    { timestamp: "09:14:22", tenant: "apex-intl", level: "INFO", message: "POST /api/fees/invoice - Invoice INV-2026-4821 generated successfully." },
    { timestamp: "09:12:05", tenant: "delhi-public", level: "INFO", message: "POST /api/admissions/convert - Lead converted to Student ADM-2026-912." },
    { timestamp: "09:10:48", tenant: "system", level: "WARN", message: "High memory utilization on worker node pool B (68%)." },
    { timestamp: "09:08:12", tenant: "st-mary", level: "INFO", message: "Database RLS session established for tenant context." }
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full font-semibold border border-cyan-500/20">
            Enterprise Infrastructure
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Platform Observability & Telemetry</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time system health, multi-tenant database connection pools, and audit event streams.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-cyan-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Live Telemetry Feed</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Platform Uptime</div>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">{metrics.uptime}</div>
          <div className="text-[10px] text-slate-500 mt-1">SLA Guarantee</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Avg Response Time</div>
          <div className="text-xl font-extrabold text-indigo-400 mt-1">{metrics.avgResponseTime}</div>
          <div className="text-[10px] text-slate-500 mt-1">Global edge latency</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Active Requests</div>
          <div className="text-xl font-extrabold text-white mt-1">{metrics.activeRequests}</div>
          <div className="text-[10px] text-slate-500 mt-1">Concurrent connections</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Error Rate</div>
          <div className="text-xl font-extrabold text-amber-400 mt-1">{metrics.errorRate}</div>
          <div className="text-[10px] text-slate-500 mt-1">HTTP 5xx / 4xx ratio</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">DB Pools</div>
          <div className="text-xl font-extrabold text-purple-400 mt-1">{metrics.databaseConnections} / 100</div>
          <div className="text-[10px] text-slate-500 mt-1">Postgres connections</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Redis Cache</div>
          <div className="text-xl font-extrabold text-cyan-400 mt-1">{metrics.redisMemory}</div>
          <div className="text-[10px] text-slate-500 mt-1">Session store memory</div>
        </div>
      </div>

      {/* Live Event Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200 flex justify-between items-center">
          <span>Real-Time Tenant Audit & Event Stream</span>
          <span className="text-xs text-slate-500 font-mono">Secure Log Stream</span>
        </div>
        <div className="p-6 font-mono text-xs space-y-3 bg-slate-950/80">
          {logs.map((log, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-3 gap-2">
              <div className="flex items-center gap-3">
                <span className="text-slate-500">{log.timestamp}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {log.tenant}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  log.level === "WARN" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {log.level}
                </span>
              </div>
              <div className="text-slate-300">{log.message}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
