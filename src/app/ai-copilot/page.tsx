'use client';

import React, { useState } from 'react';
import { Sparkles, Bot, BrainCircuit, ArrowLeft, CheckCircle2, Search, TrendingUp, AlertTriangle, FileText, Send } from 'lucide-react';
import Link from 'next/link';

export default function AICopilotModule() {
  const [copilotSuccess, setCopilotSuccess] = useState(false);
  const [promptQuery, setPromptQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'ai', message: 'Hello! I am your SmartCampus AI Copilot. I have scanned your tenant database. All attendance and fee collection metrics are optimal. How can I assist your faculty today?' }
  ]);

  const handleRunScan = () => {
    setCopilotSuccess(true);
    setTimeout(() => setCopilotSuccess(false), 3500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptQuery.trim()) return;

    const newChat = [...chatLog, { role: 'user', message: promptQuery }];
    setChatLog(newChat);
    setPromptQuery('');

    setTimeout(() => {
      setChatLog(prev => [
        ...prev,
        { role: 'ai', message: 'Analysis complete: Based on historical attendance patterns and recent formative assessments, Grade 11 Physics cohort shows a 14% improvement after the recent PTM intervention.' }
      ]);
    }, 1000);
  };

  const insights = [
    { id: 1, title: 'Dropout Risk Warning', description: '3 students in Grade 9 exhibit irregular attendance and declining quiz scores.', severity: 'High Priority', type: 'risk' },
    { id: 2, title: 'Fee Default Forecast', description: 'Estimated 4.2% fee delay expected for Q3 billing cycle across secondary wing.', severity: 'Moderate', type: 'finance' },
    { id: 3, title: 'Faculty Workload Balance', description: 'Mathematics department teaching hours are 12% above institutional threshold.', severity: 'Optimization', type: 'staff' },
  ];

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
            <span className="text-[10px] text-slate-400">AI Campus Copilot & Predictive Analytics Hub</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">AI Campus Copilot & Predictive Intelligence</h2>
            <p className="text-xs text-slate-400 mt-1">Leverage machine learning models for early dropout detection, automated lesson planning, and institutional performance forecasting.</p>
          </div>
          <button
            onClick={handleRunScan}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Run Predictive Tenant Scan</span>
          </button>
        </div>

        {copilotSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Tenant predictive scan completed successfully across 1,420 student records!</span>
          </div>
        )}

        {/* AI KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Model Accuracy Score</div>
            <div className="text-3xl font-extrabold text-cyan-400">99.1%</div>
            <div className="text-[10px] text-slate-400">Trained on multi-campus datasets</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">At-Risk Students Detected</div>
            <div className="text-3xl font-extrabold text-amber-400">3 Students</div>
            <div className="text-[10px] text-slate-400">Automated counselor alert sent</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Lesson Plans Generated</div>
            <div className="text-3xl font-extrabold text-white">310 Plans</div>
            <div className="text-[10px] text-cyan-400 font-medium">Aligned with CBSE/ICSE/IB boards</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Inference Latency</div>
            <div className="text-3xl font-extrabold text-emerald-400">110 ms</div>
            <div className="text-[10px] text-slate-400">Optimized vector search active</div>
          </div>
        </div>

        {/* AI Insights and Chat Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Predictive Insights Roster */}
          <div className="lg:col-span-1 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Predictive Insights</span>
            </h3>

            <div className="space-y-3">
              {insights.map((ins) => (
                <div key={ins.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{ins.title}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      ins.severity === 'High Priority' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {ins.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{ins.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive AI Chat Box */}
          <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span>SmartCampus AI Copilot Assistant</span>
            </h3>

            {/* Chat Log */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2 text-xs">
              {chatLog.map((chat, idx) => (
                <div key={idx} className={`flex gap-3 p-3 rounded-2xl ${
                  chat.role === 'ai' ? 'bg-slate-950 border border-slate-800 text-slate-200' : 'bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 ml-8'
                }`}>
                  <Bot className={`w-4 h-4 shrink-0 ${chat.role === 'ai' ? 'text-cyan-400' : 'text-cyan-300'}`} />
                  <div className="leading-relaxed">{chat.message}</div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Ask AI Copilot about student performance, fee trends, or lesson plans..."
                value={promptQuery}
                onChange={(e) => setPromptQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
