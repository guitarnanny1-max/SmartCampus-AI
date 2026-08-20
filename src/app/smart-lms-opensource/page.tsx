'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartLmsOpenSourcePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toolName, setToolName] = useState('');
  const [category, setCategory] = useState('SCORM/xAPI Engine');
  const [version, setVersion] = useState('v1.0.0');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [integrationStatus, setIntegrationStatus] = useState('ACTIVE');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-lms-opensource')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddTool = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-lms-opensource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName, category, version, repositoryUrl, integrationStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add open-source tool');

      setRecords([data, ...records]);
      setToolName('');
      setRepositoryUrl('');
      alert('Open-source LMS enhancement tool integrated successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/35">
                SMARTCAMPUS AI OPEN-SOURCE LMS UTILIZATION HUB 🌐
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Open-Source LMS Enhancement & Integration</h1>
            <p className="text-xs text-slate-400">Manage and utilize open-source learning management modules, SCORM parsers, AI tutoring repositories, and Moodle plugins.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleAddTool} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚙️</span> Integrate New Open-Source LMS Component
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Tool / Module Name</label>
              <input 
                type="text" 
                placeholder="e.g. Canvas LTI 1.3 Custom Connector" 
                value={toolName} 
                onChange={e => setToolName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="SCORM/xAPI Engine">SCORM / xAPI Engine</option>
                <option value="AI Tutor">AI Tutor & Agent</option>
                <option value="Moodle Plugin">Moodle Plugin</option>
                <option value="Open Courseware">Open Courseware / XBlock</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Release Version</label>
              <input 
                type="text" 
                placeholder="e.g. v2.4.1" 
                value={version} 
                onChange={e => setVersion(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">GitHub Repository URL</label>
              <input 
                type="text" 
                placeholder="e.g. https://github.com/org/repo" 
                value={repositoryUrl} 
                onChange={e => setRepositoryUrl(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Integration Status</label>
              <select 
                value={integrationStatus} 
                onChange={e => setIntegrationStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="ACTIVE">Active & Operational</option>
                <option value="DEPLOYED">Deployed</option>
                <option value="EVALUATING">Evaluating Sandbox</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
            >
              {adding ? 'Integrating Tool...' : 'Integrate Open-Source Tool →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📦</span> Integrated Open-Source LMS Modules ({records.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((r) => (
              <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {r.category} • {r.version}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-2">{r.toolName}</h4>
                    <p className="text-[11px] text-slate-400 truncate max-w-[280px]">Repo: <a href={r.repositoryUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{r.repositoryUrl}</a></p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    r.integrationStatus === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      : r.integrationStatus === 'DEPLOYED'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                  }`}>
                    {r.integrationStatus}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400">
                  <span>License: <strong className="text-white">MIT / Apache 2.0</strong></span>
                  <a href={r.repositoryUrl} target="_blank" rel="noreferrer" className="text-blue-400 font-semibold hover:underline">View Repository ↗</a>
                </div>
              </div>
            ))}
            {records.length === 0 && !loading && (
              <div className="col-span-2 p-6 text-center text-slate-500">
                No open-source LMS modules found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
