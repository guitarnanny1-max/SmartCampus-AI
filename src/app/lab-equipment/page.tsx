export const revalidate = 0;
export const dynamic = 'force-dynamic';
'./client';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LabEquipmentPage() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('SCIENTIFIC');
  const [labRoom, setLabRoom] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/lab-equipment')
      .then(res => res.json())
      .then(data => {
        setEquipment(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/lab-equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, labRoom, status: 'AVAILABLE', borrower: null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add equipment');

      setEquipment([data, ...equipment]);
      setName('');
      setLabRoom('');
      alert('Laboratory instrument successfully registered.');
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
                ACADEMIC RESEARCH & LABS
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Laboratory Equipment Portal</h1>
            <p className="text-xs text-slate-400">Manage scientific instruments, track microscope/spectrometer reservations, and monitor lab asset statuses.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddEquipment} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🔬</span> Register Lab Instrument / Asset
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Equipment Name / Model</label>
              <input 
                type="text" 
                placeholder="e.g. Laser Confocal Microscope" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Laboratory Room / Wing</label>
              <input 
                type="text" 
                placeholder="e.g. Bio-Tech Lab 402" 
                value={labRoom} 
                onChange={e => setLabRoom(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Equipment Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="SCIENTIFIC">GENERAL SCIENTIFIC</option>
                <option value="MICROSCOPY">MICROSCOPY & IMAGING</option>
                <option value="SPECTROSCOPY">SPECTROSCOPY</option>
                <option value="ELECTRONICS">ELECTRONICS & TESTING</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Registering Asset...' : 'Register Equipment →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡</span> Laboratory Asset Inventory ({equipment.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Instrument Name</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Current User / Borrower</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((eq: any) => (
                  <tr key={eq.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{eq.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {eq.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{eq.labRoom}</td>
                    <td className="p-4 text-cyan-400">{eq.borrower || 'None (In Rack)'}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        eq.status === 'AVAILABLE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {eq.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {equipment.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No laboratory equipment registered.
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
