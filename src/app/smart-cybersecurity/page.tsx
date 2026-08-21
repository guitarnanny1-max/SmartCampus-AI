export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartCybersecurityPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nodeCode, setNodeCode] = useState('');
  const [nodeName, setNodeName] = useState('');
  const [intrusionAttemptsDaily, setIntrusionAttemptsDaily] = useState('2000');
  const [qkdFidelityPct, setQkdFidelityPct] = useState('99.9');
  const [neuralDefenseLatencyMs, setNeuralDefenseLatencyMs] = useState('0.9');
  const [aiAnomalyResponseMode, setAiAnomalyResponseMode] = useState('AUTONOMOUS_QUANTUM_THREAT_NEUTRALIZATION');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-cybersecurity')
      .then(res => res.json())
      .then(data => {
        setNodes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-cybersecurity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeCode, nodeName, intrusionAttemptsDaily, qkdFidelityPct, neuralDefenseLatencyMs, aiAnomalyResponseMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register node');

      setNodes([data, ...nodes]);
      setNodeCode('');
      setNodeName('');
      alert('Cybersecurity node registered successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/35">
                QUANTUM-SECURE CYBERSECURITY & NEURAL DEFENSE HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Threat Intelligence & Neural Defense Grid</h1>
            <p className="text-xs text-slate-400">Monitor intrusion attempts, QKD fidelity (%), defense latency (ms), and AI threat remediation.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddNode} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Register Security Node
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Node Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. SEC-NODE-04" 
                value={nodeCode} 
                onChange={e => setNodeCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Node Name</label>
              <input 
                type="text" 
                placeholder="e.g. Faculty Administration Subnet" 
                value={nodeName} 
                onChange={e => setNodeName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Intrusion Attempts</label>
              <input 
                type="number" 
                value={intrusionAttemptsDaily} 
                onChange={e => setIntrusionAttemptsDaily(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">QKD Fidelity (%)</label>
              <input 
                type="number" 
                step="0.01" 
                value={qkdFidelityPct} 
                onChange={e => setQkdFidelityPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Defense Latency (ms)</label>
              <input 
                type="number" 
                step="0.1" 
                value={neuralDefenseLatencyMs} 
                onChange={e => setNeuralDefenseLatencyMs(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Response Mode</label>
              <select 
                value={aiAnomalyResponseMode} 
                onChange={e => setAiAnomalyResponseMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="AUTONOMOUS_QUANTUM_THREAT_NEUTRALIZATION">Autonomous Quantum Neutralization</option>
                <option value="PREDICTIVE_PATTERN_HEURISTIC_BLOCKING">Predictive Heuristic Blocking</option>
                <option value="REAL_TIME_TRAFFIC_SHAPING_DEFENSE">Real-Time Traffic Shaping</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-rose-500 text-slate-950 font-bold text-xs hover:bg-rose-400 transition-all disabled:opacity-50 shadow-lg shadow-rose-500/20"
            >
              {adding ? 'Registering Node...' : 'Add Security Node →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Active Security Nodes ({nodes.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Node Code & Name</th>
                  <th className="p-4 font-medium">Intrusions & QKD Fidelity</th>
                  <th className="p-4 font-medium">Defense Latency</th>
                  <th className="p-4 font-medium text-right">AI Defense Mode</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((n: any) => (
                  <tr key={n.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{n.nodeCode}</p>
                      <p className="text-[10px] text-slate-400">{n.nodeName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-rose-400 font-semibold">{n.intrusionAttemptsDaily.toLocaleString()} Daily Intrusions</p>
                      <p className="text-[10px] text-slate-400">{n.qkdFidelityPct}% QKD Fidelity</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {n.neuralDefenseLatencyMs} ms
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        n.aiAnomalyResponseMode === 'AUTONOMOUS_QUANTUM_THREAT_NEUTRALIZATION'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                          : n.aiAnomalyResponseMode === 'PREDICTIVE_PATTERN_HEURISTIC_BLOCKING'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {n.aiAnomalyResponseMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {nodes.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No security nodes registered.
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
