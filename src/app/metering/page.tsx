'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UsageMeteringPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/metering')
      .then(res => res.json())
      .then(data => {
        setMetrics(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalCost = metrics.reduce((acc, m) => acc + (m.cost || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                METERED USAGE & BILLING
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Resource Consumption Analytics</h1>
            <p className="text-xs text-slate-400">Real-time tracking of API requests, IoT data streams, and AI token consumption.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
            <span className="text-xs font-mono text-slate-400">Current Billing Cycle Total</span>
            <div className="text-3xl font-extrabold font-mono text-cyan-400">${totalCost.toFixed(2)}</div>
            <p className="text-[11px] text-slate-500">Includes base tier subscription plus metered overage consumption.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
            <span className="text-xs font-mono text-slate-400">Subscription Quota Utilization</span>
            <div className="text-3xl font-extrabold font-mono text-emerald-400">38.4%</div>
            <p className="text-[11px] text-slate-500">Well within institutional monthly allowance limits.</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📊</span> Metered Resource Breakdowns
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Metric Category</th>
                  <th className="p-4 font-medium">Quantity Consumed</th>
                  <th className="p-4 font-medium">Unit Type</th>
                  <th className="p-4 font-medium text-right">Calculated Cost</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => (
                  <tr key={m.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{m.metricName}</td>
                    <td className="p-4 font-mono text-cyan-400">{m.quantity.toLocaleString()}</td>
                    <td className="p-4 font-mono text-slate-400">{m.unit}</td>
                    <td className="p-4 font-mono text-right font-bold text-white">${m.cost.toFixed(2)}</td>
                  </tr>
                ))}
                {metrics.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No usage metrics recorded for this billing cycle.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
