'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function TeamManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('VIEWER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/team');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // For demo purposes, fetch team members via a custom or seed state
    // Let's populate mock initial state or fetch from prisma if an endpoint is provided
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add team member');

      setUsers([data, ...users]);
      setName('');
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                RBAC & ACCESS CONTROL
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Institutional Team Management</h1>
            <p className="text-xs text-slate-400">Manage administrator privileges and viewer permissions for your school account.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs">
            {error}
          </div>
        )}

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>👤</span> Invite New Staff Member
          </h3>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
            />
            <div className="flex gap-2">
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)} 
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="TENANT_ADMIN">Tenant Admin</option>
                <option value="VIEWER">Viewer</option>
              </select>
              <button 
                type="submit" 
                disabled={loading} 
                className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? 'Adding...' : 'Invite'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
