'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartFeatureTogglePage() {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/smart-feature-toggle')
      .then(res => res.json())
      .then(data => {
        setFeatures(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    const newStatus = !currentStatus;

    try {
      const res = await fetch('/api/smart-feature-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isEnabled: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update toggle');

      setFeatures(features.map(f => f.id === id ? { ...f, isEnabled: data.isEnabled } : f));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/35">
                SUPER ADMIN FEATURE CONTROL PANEL 🔒
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Enable / Disable Platform Features</h1>
            <p className="text-xs text-slate-400">Instantly activate or deactivate platform modules, integrations, and automated workflows across the institution.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚙️</span> Institutional Module Status ({features.length})
          </h3>

          <div className="space-y-3">
            {features.map((f) => (
              <div key={f.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 font-mono">[{f.featureKey}]</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      f.isEnabled 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                    }`}>
                      {f.isEnabled ? 'ACTIVE & ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{f.featureName}</h4>
                </div>

                <button
                  onClick={() => handleToggle(f.id, f.isEnabled)}
                  disabled={updatingId === f.id}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                    f.isEnabled
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/35'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  } disabled:opacity-50`}
                >
                  {updatingId === f.id ? 'Updating...' : f.isEnabled ? 'Disable Feature ✕' : 'Enable Feature ✓'}
                </button>
              </div>
            ))}
            {features.length === 0 && !loading && (
              <div className="p-6 text-center text-slate-500">
                No feature toggles configured.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
