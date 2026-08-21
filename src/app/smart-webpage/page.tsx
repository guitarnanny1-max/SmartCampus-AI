export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartWebpagePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [templateStyle, setTemplateStyle] = useState('Modern Portfolio');
  const [slug, setSlug] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch('/api/smart-webpage')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const res = await fetch('/api/smart-webpage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageTitle, authorName, templateStyle, slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate webpage');

      setRecords([data, ...records]);
      setPageTitle('');
      setAuthorName('');
      setSlug('');
      alert('Webpage created and deployed successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/35">
                SMARTCAMPUS AI WEBPAGE CREATOR HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">AI Webpage & Portfolio Builder</h1>
            <p className="text-xs text-slate-400">Instantly generate, customize, and deploy student portfolios, research landing pages, and club websites.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleGenerate} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌐</span> Generate New Webpage
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Page Title / Heading</label>
              <input 
                type="text" 
                placeholder="e.g. Rohan Sharma - Full Stack Developer" 
                value={pageTitle} 
                onChange={e => setPageTitle(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Author / Owner Name</label>
              <input 
                type="text" 
                placeholder="e.g. Rohan Sharma" 
                value={authorName} 
                onChange={e => setAuthorName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Template Style</label>
              <select 
                value={templateStyle} 
                onChange={e => setTemplateStyle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="Modern Portfolio">Modern Portfolio</option>
                <option value="Tech Startup">Tech Startup</option>
                <option value="Research Lab">Research Lab</option>
                <option value="Club Landing">Student Club Landing</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">URL Slug (e.g. rohan-portfolio)</label>
              <input 
                type="text" 
                placeholder="rohan-portfolio" 
                value={slug} 
                onChange={e => setSlug(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={generating} 
              className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-all disabled:opacity-50 shadow-lg shadow-purple-600/20"
            >
              {generating ? 'Generating Webpage...' : 'Generate & Deploy Webpage →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>✨</span> Deployed Campus Webpages ({records.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((r: any) => (
              <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      {r.templateStyle}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-2">{r.pageTitle}</h4>
                    <p className="text-[11px] text-slate-400">By {r.authorName}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                    {r.deployStatus}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-mono">/site/{r.slug}</span>
                  <span className="text-purple-400 font-semibold cursor-pointer hover:underline">Preview Site ↗</span>
                </div>
              </div>
            ))}
            {records.length === 0 && !loading && (
              <div className="col-span-2 p-6 text-center text-slate-500">
                No webpages created yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
