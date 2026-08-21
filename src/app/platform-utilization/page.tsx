export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlatformUtilizationPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/platform-utilization')
      .then(res => res.json())
      .then(json => {
        setData(Array.isArray(json) ? json : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const maxScore = Math.max(...data.map((d: any) => d.totalScore), 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/35">
                SMARTCAMPUS AI PLATFORM UTILIZATION 📊
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Top Platform Utilization</h1>
            <p className="text-xs text-slate-400">Aggregated performance metrics and active engagement across all SmartCampus integrations.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Portal
          </Link>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Top Performing Institution</h3>
            <p className="text-3xl font-extrabold text-white mt-2">
              {data.length > 0 ? data[0].name : 'N/A'}
            </p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Average Platform Health</h3>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">
              {data.length > 0 ? Math.round(data.reduce((a: any, b: any) => a + b.totalScore, 0) / data.length) : 0} <span className="text-sm text-slate-500">units/active</span>
            </p>
          </div>
        </div>

        {/* Ranking List */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white">Utilization Leaderboard</h3>
          
          {loading ? (
            <p className="text-slate-500 text-sm">Loading metrics...</p>
          ) : (
            <div className="space-y-4">
              {data.map((school, idx) => (
                <div key={school.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="font-medium">{idx + 1}. {school.name}</span>
                    <span className="font-bold text-purple-400">{school.totalScore} pts</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-1000"
                      style={{ width: `${(school.totalScore / maxScore) * 100}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-[10px] text-slate-500">
                    <span>{school.healthActivity} Health Entries</span>
                    <span>•</span>
                    <span>{school.lmsActivity} LMS Integrations</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
