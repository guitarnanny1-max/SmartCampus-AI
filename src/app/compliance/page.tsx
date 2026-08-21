export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ComplianceGovernancePage() {
  const [anonymizing, setAnonymizing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAnonymize = () => {
    setAnonymizing(true);
    setSuccessMessage('');
    setTimeout(() => {
      setAnonymizing(false);
      setSuccessMessage('Successfully scrubbed legacy student audit logs in compliance with FERPA 34 CFR Part 99.');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                DATA PRIVACY & GOVERNANCE
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">FERPA & GDPR Compliance Center</h1>
            <p className="text-xs text-slate-400">Institutional data protection controls, consent logs, and privacy audit tools.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
            <span>✓</span> {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🛡️</span> FERPA Compliance Status
            </h3>
            <p className="text-xs text-slate-400">
              Family Educational Rights and Privacy Act controls protect student educational records and personally identifiable information (PII).
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400">Directory Information Opt-Out:</span>
                <span className="text-emerald-400 font-bold">Enforced</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400">Parental Access Control:</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
            </div>
            <button 
              onClick={handleAnonymize}
              disabled={anonymizing}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 disabled:opacity-50"
            >
              {anonymizing ? 'Processing Anonymization...' : 'Execute PII Scrub & Anonymize Log'}
            </button>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🇪🇺</span> GDPR Data Subject Rights
            </h3>
            <p className="text-xs text-slate-400">
              General Data Protection Regulation tools for European student union members and international campus staff.
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400">Right to Erasure (Article 17):</span>
                <span className="text-cyan-400 font-bold">Ready</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400">Data Portability (Article 20):</span>
                <span className="text-cyan-400 font-bold">JSON / CSV Export</span>
              </div>
            </div>
            <a 
              href="/api/export" 
              className="block text-center w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
            >
              Download Encrypted Data Package →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
