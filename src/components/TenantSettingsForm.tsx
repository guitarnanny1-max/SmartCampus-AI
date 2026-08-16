'use client';

import { useState } from 'react';

export default function TenantSettingsForm({ initialName, initialLogo }: { initialName: string; initialLogo: string | null }) {
  const [name, setName] = useState(initialName);
  const [logoUrl, setLogoUrl] = useState(initialLogo || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/tenant-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, logoUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');

      setMessage('Tenant branding successfully updated!');
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 max-w-2xl">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>🎨</span> Institution Branding & Settings
        </h3>
        <p className="text-xs text-slate-400">Customize white-labeled identifiers for your active tenant</p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Institution Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none" 
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Logo Image URL</label>
          <input 
            type="url" 
            value={logoUrl} 
            onChange={e => setLogoUrl(e.target.value)} 
            placeholder="https://example.com/logo.png" 
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none" 
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading} 
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Save Branding Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
