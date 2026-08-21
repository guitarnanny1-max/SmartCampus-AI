export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ESGReportingPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/esg')
      .then(res => res.json())
      .then(data => {
        setMetrics(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalEmissions = metrics.reduce((acc: any, m: any) => acc + (m.emissions || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                ESG & SUSTAINABILITY PORTAL
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Carbon Footprint & ESG Reporting</h1>
            <p className="text-xs text-slate-400">Institutional greenhouse gas inventories, Scope 1-3 emissions, and renewable offset tracking.</p>
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
            <span className="text-xs font-mono text-slate-400">Total Annual Carbon Emissions</span>
            <div className="text-3xl font-extrabold font-mono text-emerald-400">{totalEmissions.toFixed(1)} <span className="text-sm font-normal text-slate-400">tons CO2e</span></div>
            <p className="text-[11px] text-slate-500">Calculated via real-time IoT energy monitoring and AI emission models.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
            <span className="text-xs font-mono text-slate-400">Solar Generation Offset</span>
            <div className="text-3xl font-extrabold font-mono text-cyan-400">128.4 <span className="text-sm font-normal text-slate-400">tons offset</span></div>
            <p className="text-[11px] text-slate-500">Net institutional carbon reduction achieved through campus photovoltaic arrays.</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌱</span> Emissions Inventory by Scope
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Emission Source</th>
                  <th className="p-4 font-medium">Greenhouse Gas Scope</th>
                  <th className="p-4 font-medium">Emissions (tons CO2e)</th>
                  <th className="p-4 font-medium text-right">YoY Reduction</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m: any) => (
                  <tr key={m.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{m.category}</td>
                    <td className="p-4 font-mono text-cyan-400">{m.scope}</td>
                    <td className="p-4 font-mono text-white">{m.emissions.toFixed(1)}</td>
                    <td className="p-4 font-mono text-right font-bold text-emerald-400">-{m.reduction.toFixed(1)}%</td>
                  </tr>
                ))}
                {metrics.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No ESG metrics recorded.
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
