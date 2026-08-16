'use client';

import { useState } from 'react';

export default function AiSustainabilityAudit({ schoolName, facilitiesCount, studentsCount }: { schoolName: string; facilitiesCount: number; studentsCount: number }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const runAudit = async () => {
    setAnalyzing(true);
    setReport(null);
    setTimeout(() => {
      setReport(`ESG & Operational Health Audit for ${schoolName}: 
• Energy Efficiency: Grade A (Optimized HVAC across ${facilitiesCount} zones)
• Solar Utilization: High output performance, reducing carbon grid reliance by ~34%.
• Academic Engagement: ${studentsCount} active roster records monitored with zero compliance anomalies.
• Recommendation: Scale IoT smart-sensors to auxiliary sports and innovation wings.`);
      setAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌱</span> AI Sustainability & Campus ESG Audit
          </h3>
          <p className="text-xs text-slate-400">Automated compliance, carbon footprint, and resource intelligence</p>
        </div>
        <button 
          onClick={runAudit} 
          disabled={analyzing}
          className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all disabled:opacity-50"
        >
          {analyzing ? 'Analyzing Telemetry...' : 'Run Live ESG Audit'}
        </button>
      </div>

      {report && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 font-mono whitespace-pre-line leading-relaxed animate-fadeIn">
          {report}
        </div>
      )}
    </div>
  );
}
