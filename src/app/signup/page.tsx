'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subdomain, adminEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register institution');

      router.push(`/?school=${data.subdomain}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            SmartCampus AI Cloud
          </span>
          <h1 className="text-2xl font-extrabold text-white">Provision New Institution</h1>
          <p className="text-xs text-slate-400">Launch your isolated multi-tenant energy and academic dashboard in seconds.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Institution Name</label>
            <input 
              type="text" 
              placeholder="e.g. Oakridge Academy" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none" 
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Subdomain Identifier</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-cyan-500">
              <input 
                type="text" 
                placeholder="oakridge" 
                value={subdomain} 
                onChange={e => setSubdomain(e.target.value.toLowerCase())} 
                required 
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white focus:outline-none" 
              />
              <span className="px-4 text-xs font-mono text-slate-500 bg-slate-900/50 py-3 border-l border-slate-800">.smartcampus.ai</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Administrator Email</label>
            <input 
              type="email" 
              placeholder="admin@oakridge.edu" 
              value={adminEmail} 
              onChange={e => setAdminEmail(e.target.value)} 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
          >
            {loading ? 'Provisioning Tenant...' : 'Launch Tenant Dashboard →'}
          </button>
        </form>
      </div>
    </div>
  );
}
