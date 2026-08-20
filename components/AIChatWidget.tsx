"use client";

import React, { useState } from 'react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello Admin! I am your SmartCampus AI copilot. How can I help you manage the campus today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    // Simulate smart AI response based on keywords
    setTimeout(() => {
      let reply = "I've checked the database logs for that. Everything is operating within normal parameters.";
      const lower = userMsg.toLowerCase();
      
      if (lower.includes('student') || lower.includes('enroll')) {
        reply = "There are currently 1,482 total enrolled students across all sections, with a 97.1% active attendance rate.";
      } else if (lower.includes('energy') || lower.includes('power')) {
        reply = "Current campus energy draw is at 420 kW, running at 84% efficiency with solar generation active.";
      } else if (lower.includes('bus') || lower.includes('transport') || lower.includes('delay')) {
        reply = "There are 42 active buses on the road. Route 05 is experiencing a minor 12-minute delay due to rain.";
      } else if (lower.includes('finance') || lower.includes('fee') || lower.includes('revenue')) {
        reply = "August revenue stands at $48,200 with $12,400 in pending collections across 3 overdue accounts.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Open SmartCampus AI Copilot"
        >
          🤖
        </button>
      )}

      {/* Chat Window Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '380px',
          height: '500px',
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          fontFamily: 'sans-serif',
          color: 'white',
          overflow: 'hidden'
        }}>
          
          {/* Header */}
          <div style={{ background: '#0f172a', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🤖</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px' }}>SmartCampus AI Copilot</h4>
                <span style={{ fontSize: '11px', color: '#22c55e' }}>● Online & Connected</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {/* Messages Feed */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: m.sender === 'user' ? '#3b82f6' : '#334155',
                  color: 'white',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  maxWidth: '80%',
                  lineHeight: '1.4',
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} style={{ padding: '12px', background: '#0f172a', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about students, buses, energy..."
              style={{
                flex: 1,
                background: '#1e293b',
                border: '1px solid #334155',
                padding: '10px 12px',
                borderRadius: '8px',
                color: 'white',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '10px 14px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Send
            </button>
          </form>

        </div>
      )}
    </>
  );
}
