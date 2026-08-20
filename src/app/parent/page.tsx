'use client';

import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  Bus, 
  CheckCircle2, 
  Award, 
  FileText, 
  ChevronRight,
  CreditCard,
  AlertCircle,
  Clock,
  Send
} from 'lucide-react';
import Link from 'next/link';

export default function ParentDashboard() {
  const [parent] = useState({
    name: 'Mr. Rajesh Sharma',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@example.com',
    childrenCount: 2
  });

  const [children, setChildren] = useState([
    { id: 1, name: 'Aarav Sharma', grade: 'Grade 11-A', roll: 'DPS-2026-001', attendance: 94, gpa: 3.8, teacher: 'Dr. Ramesh Kumar' },
    { id: 2, name: 'Ananya Sharma', grade: 'Grade 8-B', roll: 'DPS-2026-104', attendance: 98, gpa: 4.0, teacher: 'Mrs. Sunita Rao' }
  ]);

  const [selectedChild, setSelectedChild] = useState(1);
  const [fees, setFees] = useState([
    { id: 1, term: 'Q2 Tuition Fee (2026-27)', amount: '₹24,500', dueDate: '2026-09-10', status: 'Pending' },
    { id: 2, term: 'Transport Fee (August)', amount: '₹3,200', dueDate: '2026-08-31', status: 'Paid' },
    { id: 3, term: 'Annual Laboratory Fee', amount: '₹5,000', dueDate: '2026-07-15', status: 'Paid' }
  ]);

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'teacher', text: "Hello Mr. Sharma, Aarav performed exceptionally well in the recent Calculus quiz." }
  ]);

  const handlePayFee = (id: number) => {
    setFees(fees.map(f => f.id === id ? { ...f, status: 'Paid' } : f));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessages([...messages, { sender: 'parent', text: messageText }]);
    setMessageText('');
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'teacher', text: "Thank you for reaching out. I'll get back to you shortly regarding your query." }]);
    }, 1000);
  };

  const currentChildData = children.find(c => c.id === selectedChild) || children[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono rounded-full uppercase">
                Portal: Parent Dashboard
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">Welcome, {parent.name} 👨‍👩‍👧‍👦</h1>
            <p className="text-slate-400 text-sm">Delhi Public School • Parent ID: DPS-PAR-8092</p>
          </div>
          <div className="flex gap-3">
             <Link href="/dashboard" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-colors">
                Master Hub
             </Link>
             <Link href="/student" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white transition-colors">
                Student View
             </Link>
          </div>
        </div>

        {/* Child Selector Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {children.map(child => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              className={`px-5 py-3 rounded-2xl border text-left transition-all flex items-center gap-3 min-w-[240px] ${
                selectedChild === child.id 
                  ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/10' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300">
                {child.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-sm text-slate-100">{child.name}</div>
                <div className="text-xs font-mono text-cyan-400">{child.grade} • Attn: {child.attendance}%</div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Child Progress & Fee Management */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Selected Child Academic Overview */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  Academic Profile: {currentChildData.name}
                </h2>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  Roll: {currentChildData.roll}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400 font-mono">Current GPA</span>
                  <div className="text-2xl font-bold text-indigo-400">{currentChildData.gpa} / 4.0</div>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400 font-mono">Attendance Rate</span>
                  <div className="text-2xl font-bold text-emerald-400">{currentChildData.attendance}%</div>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400 font-mono">Homeroom Teacher</span>
                  <div className="text-sm font-bold text-cyan-400 pt-1">{currentChildData.teacher}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bus className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-200">School Bus Route #12 (GPS Live)</div>
                    <div className="text-[10px] text-slate-400">Status: On Schedule • Approaching Stop #4</div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-mono font-bold">
                  Active in Transit
                </span>
              </div>
            </div>

            {/* Fee Management & Invoices */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Fee Ledger & Online Payments
                </h2>
                <span className="text-xs font-mono text-slate-400">Secure Payment Gateway</span>
              </div>

              <div className="space-y-3">
                {fees.map(fee => (
                  <div key={fee.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-200 text-sm">{fee.term}</h3>
                      <p className="text-xs text-slate-400">Due Date: {fee.dueDate} • Amount: <span className="text-white font-bold">{fee.amount}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                        fee.status === 'Paid' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                      }`}>
                        {fee.status}
                      </span>
                      {fee.status === 'Pending' && (
                        <button 
                          onClick={() => handlePayFee(fee.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1 shadow-md shadow-emerald-500/20"
                        >
                          <CreditCard className="w-3.5 h-3.5" /> Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Col: Direct Teacher Communication */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col h-[520px] justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    Teacher Chat
                  </h2>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {currentChildData.teacher}
                  </span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 h-80 overflow-y-auto space-y-3 text-xs font-mono">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`p-3 rounded-xl max-w-[90%] ${m.sender === 'parent' ? 'bg-indigo-500/10 text-indigo-200 ml-auto border border-indigo-500/20' : 'bg-slate-900 text-slate-300 mr-auto border border-slate-800'}`}>
                      {m.text}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-slate-800">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Message teacher..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
