'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hello! I am SmartCampus AI Assistant. How can I help you explore our School Operating System today?', isBot: true }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { text: 'Thank you for reaching out! SmartCampus AI can streamline your admissions, attendance, fee collection, and parent communication. Schedule a live demo above for a full guided tour.', isBot: true }
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[450px] overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">SmartCampus Assistant</h4>
                <span className="text-[10px] text-cyan-400">Online • AI Active</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl ${
                    msg.isBot
                      ? 'bg-slate-800 text-slate-200 border border-slate-700/50'
                      : 'bg-cyan-600 text-white font-medium'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about SmartCampus..."
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button
              type="submit"
              className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-2xl shadow-cyan-900/50 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
