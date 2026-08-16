'use client';

import { useState } from 'react';

export default function ApiKeyManager({ initialKeys }: { initialKeys: { id: string; name: string; key: string; createdAt: Date }[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [keyName, setKeyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: keyName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate API key');

      setKeys([data, ...keys]);
      setKeyName('');
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
          <span>🔑</span> Developer API Keys & Integration
        </h3>
        <p className="text-xs text-slate-400">Generate and manage secure bearer tokens for IoT and third-party webhooks</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="flex gap-3">
        <input 
          type="text" 
          placeholder="Integration Name (e.g. IoT Solar Sensor)" 
          value={keyName} 
          onChange={e => setKeyName(e.target.value)} 
          required 
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'Generating...' : 'Generate Key'}
        </button>
      </form>

      <div className="space-y-3">
        {keys.map((k) => (
          <div key={k.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-white text-xs">{k.name}</h4>
              <code className="text-[11px] font-mono text-cyan-400 block mt-1">{k.key}</code>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Created {new Date(k.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
        {keys.length === 0 && (
          <div className="py-4 text-center text-slate-500 text-xs">
            No active API keys found for this tenant.
          </div>
        )}
      </div>
    </div>
  );
}
