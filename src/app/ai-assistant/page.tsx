export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { Sparkles, Bot, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AIAssistantPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResponse(`AI Assistant Analysis for "${query}": Telemetry data indicates optimal operational parameters across all 9 campus enterprise modules. No interventions required.`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus AI</h1>
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Autonomous Campus AI Copilot</span>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </Link>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 space-y-8 flex flex-col justify-center">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400 shadow-xl mb-2">
            <Bot className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Enterprise AI Copilot</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">Query real-time campus microgrids, examine attendance records, optimize transport logistics, and review financial ledgers instantly.</p>
        </div>

        <form onSubmit={handleAsk} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask anything about campus operations (e.g. 'What is the current solar offset?')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-xl"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2.5 top-2.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Analyzing...' : 'Ask AI'}</span>
            </button>
          </div>
        </form>

        {response && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Autonomous Copilot Response</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{response}</p>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus AI • www.smartcampusai.in • Autonomous Campus AI Copilot</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
