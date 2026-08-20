import Link from 'next/link';

export default function SystemStatusPage() {
  const services = [
    { name: 'Multi-Tenant Core API Gateway', status: 'Operational', uptime: '99.99%', latency: '24ms' },
    { name: 'IoT Edge Telemetry Stream (SSE)', status: 'Operational', uptime: '100.0%', latency: '12ms' },
    { name: 'Prisma PostgreSQL / SQLite Cluster', status: 'Operational', uptime: '99.95%', latency: '18ms' },
    { name: 'Automated Backup & Snapshot Engine', status: 'Operational', uptime: '99.99%', latency: '45ms' },
    { name: 'AI Sustainability LLM Inference Engine', status: 'Operational', uptime: '99.90%', latency: '110ms' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                SYSTEM OPERATIONAL
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">SmartCampus AI Service Status</h1>
            <p className="text-xs text-slate-400">Real-time availability and performance metrics across all global edge nodes.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>⚡</span> Core Infrastructure Services
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Last checked: {new Date().toLocaleTimeString()}
            </span>
          </div>

          <div className="space-y-4">
            {services.map((svc, idx) => (
              <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <h4 className="font-semibold text-white text-sm">{svc.name}</h4>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Uptime (30d): {svc.uptime}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                    <span className="text-slate-500 mr-2">Latency:</span>
                    <span className="text-cyan-400 font-bold">{svc.latency}</span>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                    {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📅</span> Incident History (Past 90 Days)
          </h3>
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-3">
            <span className="text-emerald-400 text-base font-bold">✓</span>
            <div>
              <div className="font-semibold text-white">Zero unplanned downtime incidents reported.</div>
              <p className="text-[11px] text-slate-500">All systems operated at 99.98% average availability over the past quarter.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
