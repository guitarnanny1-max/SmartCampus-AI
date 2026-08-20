'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TeamManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('TENANT_ADMIN');
  const [inviting, setInviting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setSuccess('');

    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to invite user');

      setUsers([data, ...users]);
      setName('');
      setEmail('');
      setSuccess('Team member successfully invited and assigned role permissions.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                RBAC & ACCESS CONTROL
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Institutional Team Management</h1>
            <p className="text-xs text-slate-400">Delegate administrative privileges and manage staff permission matrices.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
            <span>✓</span> {success}
          </div>
        )}

        <form onSubmit={handleInvite} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>👥</span> Invite New Staff Member
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Robert Smith" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Email Address</label>
              <input 
                type="email" 
                placeholder="e.g. robert.smith@school.edu" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Role Permission</label>
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="TENANT_ADMIN">Tenant Administrator</option>
                <option value="VIEWER">Read-Only Viewer / Auditor</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={inviting} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {inviting ? 'Sending Invite...' : 'Send Staff Invitation →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Active Team Members ({users.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Assigned Role</th>
                  <th className="p-4 font-medium text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{u.name}</td>
                    <td className="p-4 font-mono text-cyan-400">{u.email}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No team members found.
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
