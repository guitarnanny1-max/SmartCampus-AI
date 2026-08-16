'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type School = {
  id: string;
  name: string;
  subdomain: string;
  logoUrl: string | null;
  createdAt: string;
};

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSchools = async () => {
    try {
      const res = await fetch('/api/schools');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSchools(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subdomain || loading) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subdomain, logoUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create');

      setName('');
      setSubdomain('');
      setLogoUrl('');
      fetchSchools();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Platform Tenant Control Center</h2>
          <p className="text-sm text-slate-400">Provision and manage isolated school instances across SmartCampus AI.</p>
        </div>
        <Link href="/" className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:border-cyan-500 transition-colors">
          ← Return to Dashboard
        </Link>
      </div>

      {/* Provision New Tenant Form */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white tracking-wide">Onboard New Institution</h3>
        
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Institution Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Apex Academy" 
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Tenant Subdomain Code</label>
            <input 
              type="text" 
              value={subdomain} 
              onChange={e => setSubdomain(e.target.value)} 
              placeholder="e.g. apex" 
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Custom Logo URL (Optional)</label>
            <input 
              type="url" 
              value={logoUrl} 
              onChange={e => setLogoUrl(e.target.value)} 
              placeholder="https://images.unsplash.com/..." 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="md:col-span-3 flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Provisioning Tenant...' : 'Provision Tenant Instance'}
            </button>
          </div>
        </form>
      </div>

      {/* Active Tenants List */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white tracking-wide">Active Tenant Instances ({schools.length})</h3>
        <div className="space-y-3">
          {schools.map(school => (
            <div key={school.id} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                {school.logoUrl ? (
                  <img src={school.logoUrl} alt={school.name} className="w-10 h-10 rounded-xl object-cover border border-cyan-500/30" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400">
                    {school.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-white text-sm">{school.name}</h4>
                  <span className="text-xs text-cyan-400 font-mono">subdomain: {school.subdomain}</span>
                </div>
              </div>
              <Link 
                href={`/?school=${school.subdomain}`}
                className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all"
              >
                View Tenant Dashboard →
              </Link>
            </div>
          ))}
          {schools.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-sm">
              No tenant institutions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
