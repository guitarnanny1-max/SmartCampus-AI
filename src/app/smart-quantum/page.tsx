export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartQuantumPage() {
  const [processors, setProcessors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processorCode, setProcessorCode] = useState('');
  const [processorName, setProcessorName] = useState('');
  const [activeQubits, setActiveQubits] = useState('128');
  const [cryogenicTempMillikelvin, setCryogenicTempMillikelvin] = useState('15.0');
  const [coherenceTimeMicrosec, setCoherenceTimeMicrosec] = useState('450.0');
  const [aiErrorCorrectionMode, setAiErrorCorrectionMode] = useState('TOPOLOGICAL_SURFACE_CODE_CORRECTION');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-quantum')
      .then(res => res.json())
      .then(data => {
        setProcessors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddProcessor = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-quantum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processorCode, processorName, activeQubits, cryogenicTempMillikelvin, coherenceTimeMicrosec, aiErrorCorrectionMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register processor');

      setProcessors([data, ...processors]);
      setProcessorCode('');
      setProcessorName('');
      alert('Quantum processor registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                SMART QUANTUM COMPUTING & CRYOGENIC HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Quantum Processing & Cryogenic Grid</h1>
            <p className="text-xs text-slate-400">Monitor active qubits, millikelvin cooling, coherence time, and AI error correction.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddProcessor} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚛️</span> Register Quantum Processor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Processor Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. QUANTUM-PROC-04" 
                value={processorCode} 
                onChange={e => setProcessorCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Processor Name</label>
              <input 
                type="text" 
                placeholder="e.g. Advanced Cryogenic Qubit Matrix" 
                value={processorName} 
                onChange={e => setProcessorName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Active Qubits</label>
              <input 
                type="number" 
                value={activeQubits} 
                onChange={e => setActiveQubits(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Cryo Temp (mK)</label>
              <input 
                type="number" 
                step="0.1" 
                value={cryogenicTempMillikelvin} 
                onChange={e => setCryogenicTempMillikelvin(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Coherence (μs)</label>
              <input 
                type="number" 
                step="10.0" 
                value={coherenceTimeMicrosec} 
                onChange={e => setCoherenceTimeMicrosec(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Error Correction</label>
              <select 
                value={aiErrorCorrectionMode} 
                onChange={e => setAiErrorCorrectionMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="TOPOLOGICAL_SURFACE_CODE_CORRECTION">Topological Surface Code</option>
                <option value="NEURAL_DECOHERENCE_PREDICTION">Neural Decoherence Prediction</option>
                <option value="ACTIVE_ENTANGLEMENT_STABILIZATION">Active Entanglement Stabilization</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Registering Processor...' : 'Add Quantum Processor →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚛️</span> Active Quantum Processors ({processors.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Processor Code & Name</th>
                  <th className="p-4 font-medium">Qubits & Cryo Temp</th>
                  <th className="p-4 font-medium">Coherence Time</th>
                  <th className="p-4 font-medium text-right">AI Error Mode</th>
                </tr>
              </thead>
              <tbody>
                {processors.map((p: any) => (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{p.processorCode}</p>
                      <p className="text-[10px] text-slate-400">{p.processorName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-cyan-400 font-semibold">{p.activeQubits} Qubits</p>
                      <p className="text-[10px] text-slate-400">{p.cryogenicTempMillikelvin} mK Cryo Temp</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {p.coherenceTimeMicrosec} μs
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        p.aiErrorCorrectionMode === 'TOPOLOGICAL_SURFACE_CODE_CORRECTION'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : p.aiErrorCorrectionMode === 'NEURAL_DECOHERENCE_PREDICTION'
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/35'
                          : 'bg-teal-500/10 text-teal-400 border-teal-500/35'
                      }`}>
                        {p.aiErrorCorrectionMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {processors.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No quantum processors registered.
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
