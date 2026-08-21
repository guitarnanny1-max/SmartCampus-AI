export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SchoolSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [subscriptionTier, setSubscriptionTier] = useState('APEX_AUTONOMOUS');
  const [whiteLabelBrandName, setWhiteLabelBrandName] = useState('');
  const [whiteLabelLogoUrl, setWhiteLabelLogoUrl] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');

  useEffect(() => {
    fetch('/api/school-settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setSettings(data);
          setSubscriptionTier(data.subscriptionTier || 'APEX_AUTONOMOUS');
          setWhiteLabelBrandName(data.whiteLabelBrandName || '');
          setWhiteLabelLogoUrl(data.whiteLabelLogoUrl || '');
          setCustomDomain(data.customDomain || '');
          setPrimaryColor(data.primaryColor || '#6366f1');
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/school-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionTier, whiteLabelBrandName, whiteLabelLogoUrl, customDomain, primaryColor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');

      setSettings(data);
      alert('Subscription & White-Label settings saved successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/35">
                PRICE-WISE TIER ENABLING & WHITE-LABEL CUSTOMIZATION
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Institutional Branding & Subscription Hub</h1>
            <p className="text-xs text-slate-400">Manage pricing tiers, custom white-label logos, custom domains, and primary accent themes.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>💳</span> Select Subscription Tier & Feature Access
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div 
                onClick={() => setSubscriptionTier('STANDARD')}
                className={`cursor-pointer border rounded-xl p-4 transition-all ${
                  subscriptionTier === 'STANDARD' ? 'bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <p className="text-xs font-bold text-white">Standard Tier</p>
                <p className="text-[10px] text-indigo-400 font-semibold mb-2">$499 / month</p>
                <p className="text-[10px] text-slate-400">Core campus modules, attendance, gradebooks, and basic reporting.</p>
              </div>

              <div 
                onClick={() => setSubscriptionTier('PRO')}
                className={`cursor-pointer border rounded-xl p-4 transition-all ${
                  subscriptionTier === 'PRO' ? 'bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <p className="text-xs font-bold text-white">Advanced Pro</p>
                <p className="text-[10px] text-indigo-400 font-semibold mb-2">$1,499 / month</p>
                <p className="text-[10px] text-slate-400">AI analytics, WhatsApp alerts, smart campus IoT, custom logo branding.</p>
              </div>

              <div 
                onClick={() => setSubscriptionTier('ENTERPRISE')}
                className={`cursor-pointer border rounded-xl p-4 transition-all ${
                  subscriptionTier === 'ENTERPRISE' ? 'bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <p className="text-xs font-bold text-white">Enterprise Tier</p>
                <p className="text-[10px] text-indigo-400 font-semibold mb-2">$3,999 / month</p>
                <p className="text-[10px] text-slate-400">Full white-label custom domain, security robots, medical teaching hospital hub.</p>
              </div>

              <div 
                onClick={() => setSubscriptionTier('APEX_AUTONOMOUS')}
                className={`cursor-pointer border rounded-xl p-4 transition-all ${
                  subscriptionTier === 'APEX_AUTONOMOUS' ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <p className="text-xs font-bold text-white">Apex Autonomous</p>
                <p className="text-[10px] text-amber-400 font-semibold mb-2">$7,999 / month</p>
                <p className="text-[10px] text-slate-400">Unlimited access to aerospace telemetry, autonomous drones, & AI cluster.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🏷️</span> White-Label Branding & Custom Domain
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">White-Label Brand / Institution Name</label>
                <input 
                  type="text" 
                  value={whiteLabelBrandName} 
                  onChange={e => setWhiteLabelBrandName(e.target.value)} 
                  placeholder="e.g. Apex Global University" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">Custom Domain</label>
                <input 
                  type="text" 
                  value={customDomain} 
                  onChange={e => setCustomDomain(e.target.value)} 
                  placeholder="e.g. portal.apexuniversity.edu" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">White-Label Logo URL</label>
                <input 
                  type="text" 
                  value={whiteLabelLogoUrl} 
                  onChange={e => setWhiteLabelLogoUrl(e.target.value)} 
                  placeholder="https://example.com/logo.png" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">Primary Brand Accent Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={e => setPrimaryColor(e.target.value)} 
                    className="w-12 h-10 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={primaryColor} 
                    onChange={e => setPrimaryColor(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                disabled={saving} 
                className="px-6 py-3 rounded-xl bg-indigo-500 text-slate-950 font-bold text-xs hover:bg-indigo-400 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
              >
                {saving ? 'Saving Settings...' : 'Save White-Label & Pricing Settings →'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
