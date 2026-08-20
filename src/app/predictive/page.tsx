'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PredictiveMaintenancePage() {
  const [scanning, setScanning] = useState(false);
  const [forecasts, setForecasts] = useState([
    { zone: 'Academic Block A', equipment: 'HVAC Chiller Unit 1', healthScore: '92%', risk: 'Low', maintenanceDue: 'In 45 Days', action: 'Routine Filter Cleaning' },
    { zone: 'Sports Complex', equipment: 'Solar Inverter Bank B', healthScore: '78%', risk: 'Medium', maintenanceDue: 'In 12 Days', action: 'Capacitor Voltage Calibration' },
    { zone: 'Science Wing', equipment: 'Central Air Handler', healthScore: '64%', risk: 'High', maintenanceDue: 'Immediate', action: 'Compressor Bearing Replacement' },
  ]);

  const handleRunDiagnostics = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setForecasts([
        { zone: 'Academic Block A', equipment: 'HVAC Chiller Unit 1', healthScore: '94%', risk: 'Low', maintenanceDue: 'In 48 Days', action: 'Routine Filter Cleaning' },
        { zone: 'Sports Complex', equipment: 'Solar Inverter Bank B', healthScore: '81%', risk: 'Low', maintenanceDue: 'In 15 Days', action: 'Capacitor Voltage Calibration' },
        { zone: 'Science Wing', equipment: 'Central Air Handler', healthScore: '68%', risk: 'Medium', maintenanceDue: 'In 5 Days', action: 'Compressor Bearing Replacement' },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                AI PREDICTIVE ANALYTICS
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Facility Failure Forecasting Engine</h1>
            <p className="text-xs text-slate-400">Machine learning models evaluating sensor degradation curves and predicting maintenance needs.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRunDiagnostics}
              disabled={scanning}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {scanning ? 'Running AI Scan...' : 'Run Diagnostics Scan'}
            </button>
            <Link 
              href="/?school=dps" 
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚙️</span> Equipment Health & Anomaly Forecasts
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Campus Zone</th>
                  <th className="p-4 font-medium">Equipment Unit</th>
                  <th className="p-4 font-medium">Health Score</th>
                  <th className="p-4 font-medium">Failure Risk</th>
                  <th className="p-4 font-medium">Recommended Action</th>
                  <th className="p-4 font-medium text-right">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {forecasts.map((item, index) => (
                  <tr key={index} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{item.zone}</td>
                    <td className="p-4 font-mono text-cyan-400">{item.equipment}</td>
                    <td className="p-4 font-mono font-bold text-white">{item.healthScore}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.risk === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                        item.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {item.risk} Risk
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{item.action}</td>
                    <td className="p-4 text-right font-mono text-slate-400">{item.maintenanceDue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
