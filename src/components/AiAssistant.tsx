'use client';

import { useState } from 'react';

export default function AiAssistant({ schoolName }: { schoolName: string }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello! I'm your AI co-pilot for ${schoolName}. Ask me anything about energy, students, or placements.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'No response generated.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error communicating with AI assistant.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-[400px]">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            SmartCampus AI Co-Pilot
          </h3>
          <p className="text-xs text-slate-400">Contextual intelligence bound to {schoolName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2 text-sm">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-xl ${
              m.role === 'user' 
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30' 
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 text-slate-500 px-4 py-2.5 rounded-xl border border-slate-800 text-xs italic">
              Analyzing tenant records...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="pt-3 border-t border-slate-800 flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about solar output, student GPAs, or placements..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
