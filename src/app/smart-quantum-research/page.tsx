export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartQuantumResearchPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [researchNodeCode, setResearchNodeCode] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [qubitCoherencePct, setQubitCoherencePct] = useState('99.5');
  const [cryogenicCoolingKelvin, setCryogenicCoolingKelvin] = useState('0.015');
  const [workloadCapacityTflops, setWorkloadCapacityTflops] = useState('10000.0');
  const [aiJobSchedulerMode, setAiJobSchedulerMode] = useState('QUANTUM_CLASSICAL_HYBRID_OPTIMIZATION');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-quantum-research')
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
      const res = await fetch('/api/smart-quantum-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ researchNodeCode, facilityName, qubitCoherencePct, cryogenicCoolingKelvin, workloadCapacityTflops, aiJobSchedulerMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register research node');

      setNodes([data, ...nodes]);
      setResearchNodeCode('');
      setFacilityName('');
      alert('Quantum research node registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/35">
                QUANTUM SUPERCOMPUTING & RESEARCH GRID
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Advanced Campus Quantum & HPC Hub</h1>
            <p className="text-xs text-slate-400">Monitor qubit coherence (%), cryogenic cooling (K), workload capacity (TFLOPS), and AI job scheduling.</p>
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
            <span>⚛️</span> Register Research Node
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Research Node Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. Q-NODE-04" 
                value={researchNodeCode} 
                onChange={e => setResearchNodeCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Facility Name</label>
              <input 
                type="text" 
                placeholder="e.g. Quantum Cryptography & Photonics Lab" 
                value={facilityName} 
                onChange={e => setFacilityName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Qubit Coherence (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={qubitCoherencePct} 
                onChange={e => setQubitCoherencePct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Cryogenic Temp (Kelvin)</label>
              <input 
                type="number" 
                step="0.001" 
                value={cryogenicCoolingKelvin} 
                onChange={e => setCryogenicCoolingKelvin(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Workload Capacity (TFLOPS)</label>
              <input 
                type="number" 
                step="100" 
                value={workloadCapacityTflops} 
                onChange={e => setWorkloadCapacityTflops(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Job Scheduler Mode</label>
              <select 
                value={aiJobSchedulerMode} 
                onChange={e => setAiJobSchedulerMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="QUANTUM_CLASSICAL_HYBRID_OPTIMIZATION">Quantum-Classical Hybrid Optimization</option>
                <option value="PREDICTIVE_WORKLOAD_BALANCING">Predictive Workload Balancing</option>
                <option value="DEEP_LEARNING_PROTEIN_FOLDING">Deep Learning Protein Folding</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-indigo-500 text-slate-950 font-bold text-xs hover:bg-indigo-400 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
              {adding ? 'Registering Node...' : 'Add Research Node →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚛️</span> Active Research Nodes ({nodes.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Node Code & Name</th>
                  <th className="p-4 font-medium">Qubit Coherence & TFLOPS</th>
                  <th className="p-4 font-medium">Cryogenic Temp</th>
                  <th className="p-4 font-medium text-right">AI Scheduler Mode</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((n: any) => (
                  <tr key={n.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{n.researchNodeCode}</p>
                      <p className="text-[10px] text-slate-400">{n.facilityName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-indigo-400 font-semibold">{n.qubitCoherencePct}% Qubit Coherence</p>
                      <p className="text-[10px] text-slate-400">{n.workloadCapacityTflops} TFLOPS Capacity</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {n.cryogenicCoolingKelvin} K
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        n.aiJobSchedulerMode === 'QUANTUM_CLASSICAL_HYBRID_OPTIMIZATION'
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/35'
                          : n.aiJobSchedulerMode === 'PREDICTIVE_WORKLOAD_BALANCING'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {n.aiJobSchedulerMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {nodes.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No research nodes registered.
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
