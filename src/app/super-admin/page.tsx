'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SuperAdminDashboard() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [tier, setTier] = useState('ENTERPRISE');
  const [maxStudents, setMaxStudents] = useState('1000');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch('/api/schools')
      .then(res => res.json())
      .then(data => {
        setSchools(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subdomain, subscriptionTier: tier, maxStudents }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create tenant');

      setSchools([...schools, data]);
      setName('');
      setSubdomain('');
      alert('Institutional tenant successfully provisioned across global edge nodes.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/35">
                PLATFORM SUPER ADMIN
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Global Multi-Tenant Fleet Control Center</h1>
            <p className="text-xs text-slate-400">Manage all institutional tenant nodes, SaaS subscription tiers, and global edge gateways.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleCreateTenant} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏢</span> Provision New Institutional Tenant
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Institution Name</label>
              <input 
                type="text" 
                placeholder="e.g. Stanford University" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Subdomain</label>
              <input 
                type="text" 
                placeholder="e.g. stanford" 
                value={subdomain} 
                onChange={e => setSubdomain(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-cyan-400 focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Subscription Tier</label>
              <select 
                value={tier} 
                onChange={e => setTier(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="PROFESSIONAL">Professional ($499/mo)</option>
                <option value="ENTERPRISE">Enterprise ($1,299/mo)</option>
                <option value="UNLIMITED">Global Campus ($2,499/mo)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Max Student Cap</label>
              <input 
                type="number" 
                value={maxStudents} 
                onChange={e => setMaxStudents(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={creating} 
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all disabled:opacity-50 shadow-lg shadow-purple-600/20"
            >
              {creating ? 'Provisioning Tenant...' : 'Provision Global Tenant →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌐</span> Active Institutional Tenant Fleet ({schools.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Institution Name</th>
                  <th className="p-4 font-medium">Subdomain</th>
                  <th className="p-4 font-medium">Subscription Tier</th>
                  <th className="p-4 font-medium">Max Capacity</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((s) => (
                  <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{s.name}</td>
                    <td className="p-4 font-mono text-cyan-400">{s.subdomain}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/35">
                        {s.subscriptionTier}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{s.maxStudents} Students</td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/?school=${s.subdomain}`} 
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all border border-slate-700"
                      >
                        Access Tenant Portal →
                      </Link>
                    </td>
                  </tr>
                ))}
                {schools.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No tenant schools found.
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
