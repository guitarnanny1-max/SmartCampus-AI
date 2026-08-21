export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { Sparkles, Palette, Globe, ArrowLeft, CheckCircle2, Building2, Upload, ShieldCheck, Sliders } from 'lucide-react';
import Link from 'next/link';

export default function BrandingModule() {
  const [brandSuccess, setBrandSuccess] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#06b6d4');
  const [institutionName, setInstitutionName] = useState('Vidya Mandir International Academy');
  const [customDomain, setCustomDomain] = useState('portal.vidyamandir.edu');

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    setBrandSuccess(true);
    setTimeout(() => setBrandSuccess(false), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus SaaS OS</h1>
            <span className="text-[10px] text-slate-400">Multi-Tenant Whitelabel & Custom Branding Hub</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Institutional Whitelabeling & Branding</h2>
            <p className="text-xs text-slate-400 mt-1">Configure tenant-specific domain mapping, custom color palettes, institutional logos, and email header signatures.</p>
          </div>
        </div>

        {brandSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Tenant branding configuration saved and deployed globally across CDN edge caches!</span>
          </div>
        )}

        {/* Branding Configuration Form & Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-4 border-b border-slate-800">
              <Palette className="w-5 h-5 text-cyan-400" />
              <span>Tenant Theme & Domain Settings</span>
            </h3>

            <form onSubmit={handleSaveBranding} className="space-y-6 text-xs">
              <div className="space-y-2">
                <label className="text-slate-300 font-medium">Institution Display Name</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-medium">Custom Domain CNAME Mapping</label>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-medium">Primary Brand Accent Color</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono uppercase text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-medium">Institutional Logo (SVG / PNG)</label>
                <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center space-y-2 hover:border-cyan-500/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                  <div className="text-slate-300 font-medium">Click to upload or drag and drop logo file</div>
                  <div className="text-[10px] text-slate-500">Recommended: Transparent PNG, min 500x500px</div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 cursor-pointer"
              >
                Save & Deploy Whitelabel Branding
              </button>
            </form>
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-1 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <span>Live Portal Preview</span>
            </h3>

            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg" style={{ backgroundColor: primaryColor }}>
                  {institutionName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white text-xs">{institutionName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{customDomain}</div>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
                <div className="text-slate-400">Sample Button Appearance:</div>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl font-bold text-white shadow-md transition-all cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  Portal Action Button
                </button>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>SSL Secured & White-labeled Tenant Schema Active</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
