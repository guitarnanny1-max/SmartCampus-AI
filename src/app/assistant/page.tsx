'src/client';
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your SmartCampus AI Concierge. Ask me anything about campus HVAC status, solar generation, placements, or emergency procedures.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userPrompt = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userPrompt }]);
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get AI response');

      setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error connecting to AI inference engine.' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'What is the current HVAC status?',
    'How much solar energy is generated?',
    'Show recent placement statistics',
    'Are there any emergency advisories?'
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                RAG AI INFERENCE ENGINE
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">SmartCampus Virtual Assistant</h1>
            <p className="text-xs text-slate-400">Context-aware conversational intelligence connected to your institutional database.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="h-96 overflow-y-auto space-y-4 pr-2">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-cyan-500 text-slate-950 font-medium' 
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs text-slate-400 animate-pulse">
                  AI is analyzing campus telemetry...
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => setInput(qp)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-800 transition-all"
              >
                {qp}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-3 pt-2">
            <input
              type="text"
              placeholder="Ask anything about campus operations..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              Send →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
