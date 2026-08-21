export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartIdCardPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardholderName, setCardholderName] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [department, setDepartment] = useState('');
  const [rollOrEmpId, setRollOrEmpId] = useState('');
  const [validThru, setValidThru] = useState('2030-06-30');
  const [idStatus, setIdStatus] = useState('ACTIVE');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch('/api/smart-id-card')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleGenerateId = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const res = await fetch('/api/smart-id-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardholderName, role, department, rollOrEmpId, validThru, idStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate ID card');

      setRecords([data, ...records]);
      setCardholderName('');
      setRollOrEmpId('');
      setDepartment('');
      alert('Digital ID card generated successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                SMARTCAMPUS AI DIGITAL ID CARD GENERATOR
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Smart Badge & RFID ID Card Hub</h1>
            <p className="text-xs text-slate-400">Generate secure digital ID cards with encrypted QR codes for campus gate access and institutional verification.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleGenerateId} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🪪</span> Generate New Digital ID Card
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Cardholder Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Neha Sharma" 
                value={cardholderName} 
                onChange={e => setCardholderName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Cardholder Role</label>
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty / Professor</option>
                <option value="ADMIN">Campus Administrator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Department / Stream</label>
              <input 
                type="text" 
                placeholder="e.g. Mechanical Engineering" 
                value={department} 
                onChange={e => setDepartment(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Roll Number / Employee ID</label>
              <input 
                type="text" 
                placeholder="e.g. SC-2026-099" 
                value={rollOrEmpId} 
                onChange={e => setRollOrEmpId(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Valid Thru Date</label>
              <input 
                type="date" 
                value={validThru} 
                onChange={e => setValidThru(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={generating} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {generating ? 'Generating ID Card...' : 'Generate Digital ID Card →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏷️</span> Issued Campus ID Cards ({records.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((r: any) => (
              <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {r.role}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-2">{r.cardholderName}</h4>
                    <p className="text-[11px] text-slate-400">{r.department}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    r.idStatus === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                  }`}>
                    {r.idStatus}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-end text-[11px]">
                  <div>
                    <p className="text-slate-500">ID / Roll No</p>
                    <p className="text-slate-200 font-mono font-semibold">{r.rollOrEmpId}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Valid Thru</p>
                    <p className="text-slate-200 font-mono">{r.validThru}</p>
                  </div>
                  <div className="bg-white p-1 rounded">
                    <div className="w-8 h-8 bg-slate-900 flex items-center justify-center text-[8px] text-white font-mono">QR</div>
                  </div>
                </div>
              </div>
            ))}
            {records.length === 0 && !loading && (
              <div className="col-span-2 p-6 text-center text-slate-500">
                No ID card records found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
