export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartFeeBursarPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [tuitionAmountInr, setTuitionAmountInr] = useState('125000');
  const [scholarshipInr, setScholarshipInr] = useState('25000');
  const [paymentStatus, setPaymentStatus] = useState('PAID');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-fee-bursar')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-fee-bursar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, rollNumber, tuitionAmountInr, scholarshipInr, paymentStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record fee bursar entry');

      setRecords([data, ...records]);
      setStudentName('');
      setRollNumber('');
      alert('Fee bursar record created successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                SMARTCAMPUS AI FEE BURSAR & SCHOLARSHIP HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Institutional Fee & Scholarship Ledger</h1>
            <p className="text-xs text-slate-400">Track tuition receipts, scholarship disbursements, and payment statuses in Indian Rupees (₹).</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleAddRecord} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>💳</span> Record Student Tuition & Scholarship
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Student Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Neha Sharma" 
                value={studentName} 
                onChange={e => setStudentName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Roll Number / Enrollment ID</label>
              <input 
                type="text" 
                placeholder="e.g. SC-2026-089" 
                value={rollNumber} 
                onChange={e => setRollNumber(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Tuition Amount (₹)</label>
              <input 
                type="number" 
                value={tuitionAmountInr} 
                onChange={e => setTuitionAmountInr(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Scholarship Grant (₹)</label>
              <input 
                type="number" 
                value={scholarshipInr} 
                onChange={e => setScholarshipInr(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Payment Status</label>
              <select 
                value={paymentStatus} 
                onChange={e => setPaymentStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="PAID">Paid in Full</option>
                <option value="PENDING">Pending Dues</option>
                <option value="PARTIAL">Partial Payment</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {adding ? 'Recording Ledger...' : 'Record Fee Entry →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>💰</span> Fee Bursar & Scholarship Ledger ({records.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Student & Roll No</th>
                  <th className="p-4 font-medium">Tuition & Scholarship</th>
                  <th className="p-4 font-medium text-right">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r: any) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{r.studentName}</p>
                      <p className="text-[10px] text-slate-400">{r.rollNumber}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-emerald-400 font-semibold">₹ {r.tuitionAmountInr.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">Scholarship: ₹ {r.scholarshipInr.toLocaleString()}</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        r.paymentStatus === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : r.paymentStatus === 'PARTIAL'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                      }`}>
                        {r.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No fee bursar records found.
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
