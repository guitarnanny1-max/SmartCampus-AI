'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Search, 
  Plus, 
  Layers, 
  ArrowUpRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function FeesPortal() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [feeRecords, setFeeRecords] = useState([
    { id: 1, student: 'Aarav Sharma', roll: 'DPS-2026-001', grade: 'Grade 11-A', item: 'Q2 Tuition Fee (2026-27)', amount: '₹24,500', dueDate: '2026-09-10', status: 'Pending' },
    { id: 2, student: 'Diya Patel', roll: 'DPS-2026-002', grade: 'Grade 11-A', item: 'Q2 Tuition Fee (2026-27)', amount: '₹24,500', dueDate: '2026-09-10', status: 'Paid' },
    { id: 3, student: 'Kabir Mehta', roll: 'DPS-2026-003', grade: 'Grade 11-A', item: 'Transport Fee (August)', amount: '₹3,200', dueDate: '2026-08-31', status: 'Paid' },
    { id: 4, student: 'Ananya Iyer', roll: 'DPS-2026-004', grade: 'Grade 11-A', item: 'Annual Laboratory Fee', amount: '₹5,000', dueDate: '2026-07-15', status: 'Pending' },
    { id: 5, student: 'Rohan Verma', roll: 'DPS-2026-005', grade: 'Grade 11-A', item: 'Sports & Athletics Levy', amount: '₹2,800', dueDate: '2026-08-25', status: 'Pending' }
  ]);

  const [newStudent, setNewStudent] = useState('');
  const [newRoll, setNewRoll] = useState('');
  const [newItem, setNewItem] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const handleMarkPaid = (id: number) => {
    setFeeRecords(feeRecords.map(r => r.id === id ? { ...r, status: 'Paid' } : r));
  };

  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.trim() || !newAmount.trim()) return;
    setFeeRecords([
      { 
        id: feeRecords.length + 1, 
        student: newStudent, 
        roll: newRoll || 'DPS-2026-999', 
        grade: 'Grade 11-B', 
        item: newItem || 'General Tuition Fee', 
        amount: `₹${newAmount}`, 
        dueDate: '2026-09-30', 
        status: 'Pending' 
      },
      ...feeRecords
    ]);
    setNewStudent('');
    setNewRoll('');
    setNewItem('');
    setNewAmount('');
  };

  const filteredRecords = feeRecords.filter(r => 
    r.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.roll.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono rounded-full uppercase">
                Portal: Fees & Finance Management
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">Financial Ledger & Revenue Hub 💳</h1>
            <p className="text-slate-400 text-sm">Delhi Public School • Accounts & Billing Department</p>
          </div>
          <div className="flex gap-3">
             <Link href="/dashboard" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-colors">
                Master Hub
             </Link>
             <Link href="/parent" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white transition-colors">
                Parent Portal View
             </Link>
          </div>
        </div>

        {/* Financial Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-mono">Total Collected (Q2)</span>
              <div className="text-2xl font-bold text-emerald-400">₹42,85,000</div>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-mono">Pending Receivables</span>
              <div className="text-2xl font-bold text-amber-400">₹7,42,000</div>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-mono">Collection Rate</span>
              <div className="text-2xl font-bold text-cyan-400">85.2%</div>
            </div>
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-mono">Gateway Status</span>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure (Razorpay / Stripe)
              </div>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Fee Records Table */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Student Fee Ledger & Invoices
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search student or roll..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto">
              {filteredRecords.map(rec => (
                <div key={rec.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400">{rec.roll}</span>
                      <span className="text-xs text-slate-500 font-mono">• {rec.grade}</span>
                    </div>
                    <div className="font-bold text-slate-200 text-sm">{rec.student}</div>
                    <div className="text-xs text-slate-400 font-mono">{rec.item} • Due: {rec.dueDate}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-white">{rec.amount}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                      rec.status === 'Paid' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    }`}>
                      {rec.status}
                    </span>
                    {rec.status === 'Pending' && (
                      <button 
                        onClick={() => handleMarkPaid(rec.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20"
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issue New Invoice Form */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                Issue Custom Invoice
              </h2>
            </div>

            <form onSubmit={handleAddInvoice} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1">Student Name</label>
                <input 
                  type="text" 
                  value={newStudent}
                  onChange={e => setNewStudent(e.target.value)}
                  placeholder="e.g. Priya Sharma" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1">Roll / ID Number</label>
                <input 
                  type="text" 
                  value={newRoll}
                  onChange={e => setNewRoll(e.target.value)}
                  placeholder="e.g. DPS-2026-042" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1">Fee Item / Description</label>
                <input 
                  type="text" 
                  value={newItem}
                  onChange={e => setNewItem(e.target.value)}
                  placeholder="e.g. Bus Transport Fee (Sept)" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1">Amount (INR)</label>
                <input 
                  type="text" 
                  value={newAmount}
                  onChange={e => setNewAmount(e.target.value)}
                  placeholder="e.g. 4,500" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/20 pt-3"
              >
                <Plus className="w-4 h-4" /> Publish Fee Invoice
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
