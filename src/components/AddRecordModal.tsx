'use client';

import { useState } from 'react';

export default function AddRecordModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'facility' | 'student'>('facility');
  
  // Facility fields
  const [zoneName, setZoneName] = useState('');
  const [solar, setSolar] = useState('');
  const [hvac, setHvac] = useState('');
  
  // Student fields
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [cgpa, setCgpa] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const body = type === 'facility' 
        ? { type: 'facility', zoneName, solar, hvac }
        : { type: 'student', name, rollNo, cgpa };

      const res = await fetch('/api/tenant-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add record');

      setIsOpen(false);
      setZoneName(''); setSolar(''); setHvac('');
      setName(''); setRollNo(''); setCgpa('');
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
      >
        <span>+ Add Tenant Record</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Record to Active Tenant</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setType('facility')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  type === 'facility' 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' 
                    : 'border-slate-800 text-slate-400'
                }`}
              >
                Facility Zone
              </button>
              <button 
                type="button" 
                onClick={() => setType('student')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  type === 'student' 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' 
                    : 'border-slate-800 text-slate-400'
                }`}
              >
                Student Record
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {type === 'facility' ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Zone Name</label>
                    <input 
                      type="text" 
                      value={zoneName} 
                      onChange={e => setZoneName(e.target.value)} 
                      placeholder="e.g. Library Hall" 
                      required 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Solar Generation</label>
                    <input 
                      type="text" 
                      value={solar} 
                      onChange={e => setSolar(e.target.value)} 
                      placeholder="e.g. 50 kW" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">HVAC Mode</label>
                    <input 
                      type="text" 
                      value={hvac} 
                      onChange={e => setHvac(e.target.value)} 
                      placeholder="e.g. Eco Mode (23°C)" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none" 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Student Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="e.g. Priya Sharma" 
                      required 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Roll Number</label>
                    <input 
                      type="text" 
                      value={rollNo} 
                      onChange={e => setRollNo(e.target.value)} 
                      placeholder="e.g. DPS-2026-04" 
                      required 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">CGPA</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={cgpa} 
                      onChange={e => setCgpa(e.target.value)} 
                      placeholder="e.g. 9.5" 
                      required 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none" 
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
