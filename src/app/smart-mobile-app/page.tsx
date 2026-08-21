export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartMobileAppPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appName, setAppName] = useState('SmartCampus Enterprise App');
  const [platform, setPlatform] = useState('BOTH');
  const [version, setVersion] = useState('v1.3.0');
  const [syncedWebpage, setSyncedWebpage] = useState('All Unique Webpages & Themes');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetch('/api/smart-mobile-app')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);

    try {
      const res = await fetch('/api/smart-mobile-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName, platform, version, syncedWebpage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit app for publishing');

      setRecords([data, ...records]);
      alert('Mobile app build successfully compiled and submitted to app stores with webpage sync!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/35">
                SMARTCAMPUS AI MOBILE APP & STORE HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Android & iOS App Store Publisher</h1>
            <p className="text-xs text-slate-400">Compile your SmartCampus portal and unique webpages into native Android & iOS apps with automated store updates.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handlePublish} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📱</span> Build & Publish App Update to Stores
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Application Name</label>
              <input 
                type="text" 
                value={appName} 
                onChange={e => setAppName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Target Platform</label>
              <select 
                value={platform} 
                onChange={e => setPlatform(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="BOTH">Both Android & iOS (Universal)</option>
                <option value="ANDROID">Google Play Store (Android APK/AAB)</option>
                <option value="IOS">Apple App Store (iOS IPA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">App Version</label>
              <input 
                type="text" 
                value={version} 
                onChange={e => setVersion(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Synced Webpage / Theme Payload</label>
              <input 
                type="text" 
                value={syncedWebpage} 
                onChange={e => setSyncedWebpage(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={publishing} 
              className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              {publishing ? 'Compiling & Submitting...' : 'Publish to Google Play & App Store →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🚀</span> Published Mobile Apps & Store Releases ({records.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((r: any) => (
              <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {r.platform} • {r.version}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-2">{r.appName}</h4>
                    <p className="text-[11px] text-slate-400">Synced: {r.syncedWebpage}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                    {r.storeStatus}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Build: <strong className="text-white">{r.buildStatus}</strong></span>
                  <span className="text-amber-400 font-semibold cursor-pointer hover:underline">Manage Release ↗</span>
                </div>
              </div>
            ))}
            {records.length === 0 && !loading && (
              <div className="col-span-2 p-6 text-center text-slate-500">
                No mobile app releases found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
