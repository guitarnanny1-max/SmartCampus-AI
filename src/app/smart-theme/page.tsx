export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartThemePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [themeName, setThemeName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#06b6d4');
  const [accentColor, setAccentColor] = useState('#8b5cf6');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [layoutStyle, setLayoutStyle] = useState('Modern Minimalist');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch('/api/smart-theme')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCreateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const res = await fetch('/api/smart-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeName, primaryColor, accentColor, fontFamily, layoutStyle, status: 'ACTIVE' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate theme');

      // Refresh records list
      const updatedRes = await fetch('/api/smart-theme');
      const updatedData = await updatedRes.json();
      setRecords(Array.isArray(updatedData) ? updatedData : [data]);

      setThemeName('');
      alert('Custom website theme generated and applied successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/35">
                SMARTCAMPUS AI UNLIMITED THEME HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Website Theme Generator & Customizer</h1>
            <p className="text-xs text-slate-400">Instantly generate unlimited professional color palettes, typography variants, and layouts for your school website.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleCreateTheme} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎨</span> Create Custom Website Theme
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Theme Name</label>
              <input 
                type="text" 
                placeholder="e.g. Apex Quantum Academy" 
                value={themeName} 
                onChange={e => setThemeName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Layout Style</label>
              <select 
                value={layoutStyle} 
                onChange={e => setLayoutStyle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none"
              >
                <option value="Modern Minimalist">Modern Minimalist</option>
                <option value="Classic Academic">Classic Academic</option>
                <option value="Bold Vibrant">Bold Vibrant</option>
                <option value="Dark Cyber">Dark Cyber</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Primary Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={primaryColor} 
                  onChange={e => setPrimaryColor(e.target.value)} 
                  className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={primaryColor} 
                  onChange={e => setPrimaryColor(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-pink-500 focus:outline-none" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Accent Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={accentColor} 
                  onChange={e => setAccentColor(e.target.value)} 
                  className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={accentColor} 
                  onChange={e => setAccentColor(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-pink-500 focus:outline-none" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Typography Font</label>
              <select 
                value={fontFamily} 
                onChange={e => setFontFamily(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none"
              >
                <option value="Inter">Inter (Clean Sans)</option>
                <option value="Poppins">Poppins (Modern Rounded)</option>
                <option value="Outfit">Outfit (Geometric Tech)</option>
                <option value="Roboto">Roboto (Standard Professional)</option>
              </select>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Theme Preview</p>
            <div className="p-4 rounded-xl border border-slate-800/80 space-y-3" style={{ background: '#090d16' }}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white" style={{ fontFamily }}>{themeName || 'Preview Theme'}</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: primaryColor }}>{layoutStyle}</span>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-white" style={{ background: primaryColor }}>Primary Action</div>
                <div className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-white" style={{ background: accentColor }}>Accent Highlight</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={generating} 
              className="px-6 py-3 rounded-xl bg-pink-500 text-slate-950 font-bold text-xs hover:bg-pink-400 transition-all disabled:opacity-50 shadow-lg shadow-pink-500/20"
            >
              {generating ? 'Generating Theme...' : 'Generate & Apply Theme →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>✨</span> Available School Website Themes ({records.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((r: any) => (
              <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: r.primaryColor }}></span>
                      <span className="w-3 h-3 rounded-full" style={{ background: r.accentColor }}></span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-2">{r.themeName}</h4>
                    <p className="text-[11px] text-slate-400">Layout: {r.layoutStyle} • Font: {r.fontFamily}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    r.status === 'ACTIVE' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
            {records.length === 0 && !loading && (
              <div className="col-span-2 p-6 text-center text-slate-500">
                No themes found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
