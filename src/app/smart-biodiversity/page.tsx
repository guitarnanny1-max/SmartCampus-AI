export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartBiodiversityPage() {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoneCode, setZoneCode] = useState('');
  const [zoneName, setZoneName] = useState('');
  const [wildlifeSpeciesCount, setWildlifeSpeciesCount] = useState('50');
  const [acousticClarityPct, setAcousticClarityPct] = useState('97.0');
  const [habitatRestorationIdx, setHabitatRestorationIdx] = useState('90.0');
  const [aiAcousticClassification, setAiAcousticClassification] = useState('REAL_TIME_SPECIES_AUDIO_EMBEDDING');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-biodiversity')
      .then(res => res.json())
      .then(data => {
        setZones(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-biodiversity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneCode, zoneName, wildlifeSpeciesCount, acousticClarityPct, habitatRestorationIdx, aiAcousticClassification }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register biodiversity zone');

      setZones([data, ...zones]);
      setZoneCode('');
      setZoneName('');
      alert('Biodiversity conservation zone registered successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                BIO-ACOUSTIC WILDLIFE & BIODIVERSITY HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Biodiversity & Ecosystem Health</h1>
            <p className="text-xs text-slate-400">Monitor wildlife species counts, acoustic clarity (%), habitat restoration indices, and AI species classification.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddZone} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🦉</span> Register Conservation Zone
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Zone Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. BIO-ZONE-04" 
                value={zoneCode} 
                onChange={e => setZoneCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Zone Name</label>
              <input 
                type="text" 
                placeholder="e.g. Campus Ecological Prairie Restoration Area" 
                value={zoneName} 
                onChange={e => setZoneName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Wildlife Species Count</label>
              <input 
                type="number" 
                value={wildlifeSpeciesCount} 
                onChange={e => setWildlifeSpeciesCount(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Acoustic Clarity (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={acousticClarityPct} 
                onChange={e => setAcousticClarityPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Habitat Index (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={habitatRestorationIdx} 
                onChange={e => setHabitatRestorationIdx(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Classification Mode</label>
              <select 
                value={aiAcousticClassification} 
                onChange={e => setAiAcousticClassification(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="REAL_TIME_SPECIES_AUDIO_EMBEDDING">Real-Time Species Audio Embedding</option>
                <option value="AVIAN_SONG_MIGRATION_TRACKING">Avian Song Migration Tracking</option>
                <option value="INSECT_BIO_ACOUSTIC_INDEXING">Insect Bio-Acoustic Indexing</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {adding ? 'Registering Zone...' : 'Add Conservation Zone →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🦉</span> Active Conservation Zones ({zones.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Zone Code & Name</th>
                  <th className="p-4 font-medium">Species Count & Acoustic Clarity</th>
                  <th className="p-4 font-medium">Habitat Index</th>
                  <th className="p-4 font-medium text-right">AI Classification Mode</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((z: any) => (
                  <tr key={z.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{z.zoneCode}</p>
                      <p className="text-[10px] text-slate-400">{z.zoneName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-emerald-400 font-semibold">{z.wildlifeSpeciesCount} Species Recorded</p>
                      <p className="text-[10px] text-slate-400">{z.acousticClarityPct}% Acoustic Clarity</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {z.habitatRestorationIdx}% Restoration
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        z.aiAcousticClassification === 'REAL_TIME_SPECIES_AUDIO_EMBEDDING'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : z.aiAcousticClassification === 'AVIAN_SONG_MIGRATION_TRACKING'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {z.aiAcousticClassification}
                      </span>
                    </td>
                  </tr>
                ))}
                {zones.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No conservation zones registered.
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
