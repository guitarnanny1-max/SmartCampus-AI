'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { time: '06:00', solar: 5, load: 12 },
  { time: '09:00', solar: 25, load: 30 },
  { time: '12:00', solar: 65, load: 45 },
  { time: '15:00', solar: 50, load: 40 },
  { time: '18:00', solar: 15, load: 25 },
  { time: '21:00', solar: 2, load: 15 },
];

export default function EnergyChart({ schoolName }: { schoolName: string }) {
  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡</span> Real-Time Campus Energy & Solar Yield
          </h3>
          <p className="text-xs text-slate-400">24-hour telemetry metrics for {schoolName}</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Solar Generation
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Grid Load
          </div>
        </div>
      </div>

      <div className="h-[260px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="solarColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="loadColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }} 
            />
            <Area type="monotone" dataKey="solar" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#solarColor)" />
            <Area type="monotone" dataKey="load" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#loadColor)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
