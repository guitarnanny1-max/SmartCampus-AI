#!/bin/bash
set -e

echo "🚀 Creating AI Chat Widget component..."

mkdir -p src/components

cat << 'EOL' > src/components/AIChatWidget.tsx
"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm SmartCampus AI. Are you looking to explore our School ERP & CRM platform for your institution?"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // Simulate or call your actual AI chat endpoint here
      // For demonstration, let's simulate smart parsing or reply back
      setTimeout(async () => {
        let aiReply = "That sounds great! Could you please share your Name and School Name so we can connect you with the right advisor?";
        
        // Simple heuristic check if user provided contact details to trigger CRM sync
        if (userMessage.toLowerCase().includes("@") || userMessage.length > 10) {
          aiReply = "Thank you! I've logged your details into our priority admissions pipeline. Our team will reach out shortly!";
          
          if (!leadCaptured) {
            setLeadCaptured(true);
            // Trigger CRM Capture API call with parsed mock data for demonstration
            try {
              await fetch("/api/chat/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: "Inbound Visitor",
                  school: "Demo School",
                  phone: "+19876543210",
                  email: userMessage.includes("@") ? userMessage : "visitor@school.com",
                  studentStrength: 1200,
                  location: "New York",
                  interest: "Full ERP & CRM Suite"
                })
              });
            } catch (err) {
              console.error("Failed to auto-save lead:", err);
            }
          }
        }

        setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I ran into an issue. Please try again." }
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105"
          aria-label="Open AI Chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              <h3 className="font-semibold text-sm">SmartCampus AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-indigo-200 hover:text-white font-bold text-lg"
            >
              &times;
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 p-3 rounded-xl border border-gray-200 text-xs animate-pulse">
                  AI is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-xl px-3 text-sm focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
EOL
echo "✨ Created src/components/AIChatWidget.tsx successfully!"
