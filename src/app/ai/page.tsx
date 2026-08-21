export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { Sparkles, Cpu, Send, ArrowLeft, Bot, User, CheckCircle2, Shield, Layers } from 'lucide-react';
import Link from 'next/link';

export default function AICopilotModule() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your SmartCampus AI Copilot powered by ThomasG Technologies GPT-4o cluster. How can I assist you with your campus operations today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "What is my current semester fee balance?",
    "When is my next AI proctored examination?",
    "Show live shuttle GPS telemetry for Route 4",
    "How do I reserve a digital asset in the library?"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');
    setLoading(true);

    setTimeout(() => {
      let aiResponse = "I have processed your query through the secure multi-tenant PostgreSQL schema. All academic and administrative records are up to date.";
      if (query.toLowerCase().includes('fee')) {
        aiResponse = "Your current fee ledger shows $0 balance for Fall Semester 2026. Tax receipt #TX-9842 is available for download in the portal.";
      } else if (query.toLowerCase().includes('exam')) {
        aiResponse = "Your next AI proctored examination is 'Advanced Database Architecture' scheduled for August 20, 2026 at 10:00 AM IST. Ensure your webcam and ID are ready.";
      } else if (query.toLowerCase().includes('shuttle')) {
        aiResponse = "Shuttle Route 4 is currently active, located 1.2 km away from North Gate. Estimated arrival time is 4 minutes.";
      } else if (query.toLowerCase().includes('library')) {
        aiResponse = "You can reserve digital e-book licenses and physical catalog items instantly via the RFID checkout scanner in the `/library` module.";
      }

      setMessages([...newMsgs, { sender: 'ai', text: aiResponse }]);
      setLoading(false);
    }, 800);
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
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus AI</h1>
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • GPT-4o Campus Assistant</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </Link>
      </header>

      {/* Main Chat Interface */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10 flex flex-col space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">AI Campus Copilot & Knowledge Engine</h2>
          <p className="text-xs text-slate-400">Ask natural language questions regarding academics, finance, exams, and hostel facilities.</p>
        </div>

        {/* Quick Prompt Chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-xs text-cyan-400 transition-all cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Box */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-2xl min-h-[420px]">
          <div className="space-y-4 overflow-y-auto pr-2 max-h-[400px]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`p-2 rounded-xl shrink-0 ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'}`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-xs max-w-xl leading-relaxed ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-400 italic">
                  GPT-4o cluster is generating institutional response...
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-800">
            <input
              type="text"
              placeholder="Ask anything about fees, exams, timetable, or transport..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Send Query</span>
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus AI • www.smartcampusai.in • AI Campus Assistant & Copilot</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
