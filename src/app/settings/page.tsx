'use client';

import React, { useState } from 'react';
import { Sparkles, Settings, Globe, Key, Bell, Shield, ArrowLeft, CheckCircle2, Save, Database } from 'lucide-react';
import Link from 'next/link';

export default function SettingsModule() {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [institutionName, setInstitutionName] = useState('Silicon Valley Hub (Main Campus)');
  const [domain, setDomain] = useState('hub.smartcampus.os');
  const [timezone, setTimezone] = useState('UTC-08:00 (Pacific Time)');
  const [whatsappToken, setWhatsappToken] = useState('EAAG_META_CLOUD_API_SECURE_TOKEN_9041');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
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
            <span className="text-[10px] text-slate-400">Settings & System Configurations</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">System & Tenant Settings</h2>
            <p className="text-xs text-slate-400 mt-1">Configure institutional workspace branding, API integrations, security policies, and notification channels.</p>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>System configurations updated successfully across multi-tenant cluster nodes.</span>
          </div>
        )}

        {/* Settings Form Card */}
        <form onSubmit={handleSaveSettings} className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-xl">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Institutional Workspace Parameters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Institution Name */}
            <div className="space-y-1.5">
              <label className="font-medium text-slate-300">Institution Workspace Name</label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Custom Domain */}
            <div className="space-y-1.5">
              <label className="font-medium text-slate-300">Custom Tenant Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            </div>

            {/* Timezone */}
            <div className="space-y-1.5">
              <label className="font-medium text-slate-300">Institutional Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option>UTC-08:00 (Pacific Time)</option>
                <option>UTC+00:00 (Greenwich Mean Time)</option>
                <option>UTC+05:30 (Indian Standard Time)</option>
                <option>UTC+08:00 (Singapore Standard Time)</option>
              </select>
            </div>

            {/* WhatsApp Business API Token */}
            <div className="space-y-1.5">
              <label className="font-medium text-slate-300">WhatsApp Cloud API Secret Key</label>
              <input
                type="password"
                value={whatsappToken}
                onChange={(e) => setWhatsappToken(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus SaaS OS • Enterprise Settings & Configuration Hub</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Powered by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
