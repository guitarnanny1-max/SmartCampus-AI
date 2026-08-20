'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartHolographicPage() {
  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lectureHallCode, setLectureHallCode] = useState('');
  const [hallName, setHallName] = useState('');
  const [holographicFidelityPct, setHolographicFidelityPct] = useState('99.5');
  const [audioLatencyMs, setAudioLatencyMs] = useState('4.0');
  const [concurrentAvatarsCount, setConcurrentAvatarsCount] = useState('300');
  const [aiRealTimeTranslationMode, setAiRealTimeTranslationMode] = useState('NEURAL_SYNCHRONOUS_MULTI_LANGUAGE');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-holographic')
      .then(res => res.json())
      .then(data => {
        setHalls(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddHall = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-holographic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lectureHallCode, hallName, holographicFidelityPct, audioLatencyMs, concurrentAvatarsCount, aiRealTimeTranslationMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register hall');

      setHalls([data, ...halls]);
      setLectureHallCode('');
      setHallName('');
      alert('Holographic lecture hall registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/35">
                HOLOGRAPHIC LECTURE & TELEPRESENCE HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Immersive AV & Telepresence Grid</h1>
            <p className="text-xs text-slate-400">Monitor holographic fidelity (%), spatial audio latency (ms), active avatars, and AI neural translation.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddHall} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📡</span> Register Lecture Hall
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Hall Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. HOLO-HALL-04" 
                value={lectureHallCode} 
                onChange={e => setLectureHallCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Hall Name</label>
              <input 
                type="text" 
                placeholder="e.g. Innovation Robotics Immersive Bay" 
                value={hallName} 
                onChange={e => setHallName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Holographic Fidelity (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={holographicFidelityPct} 
                onChange={e => setHolographicFidelityPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Audio Latency (ms)</label>
              <input 
                type="number" 
                step="0.1" 
                value={audioLatencyMs} 
                onChange={e => setAudioLatencyMs(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Concurrent Avatars</label>
              <input 
                type="number" 
                value={concurrentAvatarsCount} 
                onChange={e => setConcurrentAvatarsCount(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Translation Mode</label>
              <select 
                value={aiRealTimeTranslationMode} 
                onChange={e => setAiRealTimeTranslationMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="NEURAL_SYNCHRONOUS_MULTI_LANGUAGE">Neural Synchronous Multi-Language</option>
                <option value="BIOMETRIC_GAZE_SYNCHRONIZATION">Biometric Gaze Synchronization</option>
                <option value="ANATOMICAL_VOLUMETRIC_RENDERING">Anatomical Volumetric Rendering</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-violet-500 text-slate-950 font-bold text-xs hover:bg-violet-400 transition-all disabled:opacity-50 shadow-lg shadow-violet-500/20"
            >
              {adding ? 'Registering Hall...' : 'Add Lecture Hall →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📡</span> Active Lecture Halls ({halls.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Hall Code & Name</th>
                  <th className="p-4 font-medium">Fidelity & Avatars</th>
                  <th className="p-4 font-medium">Audio Latency</th>
                  <th className="p-4 font-medium text-right">AI Translation Mode</th>
                </tr>
              </thead>
              <tbody>
                {halls.map((h) => (
                  <tr key={h.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{h.lectureHallCode}</p>
                      <p className="text-[10px] text-slate-400">{h.hallName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-violet-400 font-semibold">{h.holographicFidelityPct}% Fidelity</p>
                      <p className="text-[10px] text-slate-400">{h.concurrentAvatarsCount} Active Avatars</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {h.audioLatencyMs} ms
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        h.aiRealTimeTranslationMode === 'NEURAL_SYNCHRONOUS_MULTI_LANGUAGE'
                          ? 'bg-violet-500/10 text-violet-400 border-violet-500/35'
                          : h.aiRealTimeTranslationMode === 'BIOMETRIC_GAZE_SYNCHRONIZATION'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {h.aiRealTimeTranslationMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {halls.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No holographic lecture halls registered.
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
