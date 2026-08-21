"use client";
import { useState } from "react";

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Hello! Ask me anything about students, exams, energy, or staff." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: "ai", text: data.reply || "I am processing your request." }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "ai", text: "Sorry, I encountered an error connecting to the campus AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition duration-200"
          title="Open Smart Campus AI Assistant"
        >
          🤖
        </button>
      ) : (
        <div className="w-80 sm:w-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col h-[450px] text-white">
          <div className="p-4 bg-gray-800 rounded-t-2xl flex justify-between items-center border-b border-gray-700">
            <h3 className="font-bold flex items-center gap-2">🤖 Smart Campus AI</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-lg font-bold">×</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
            {messages.map((m, idx) => (
              <div key={idx} className={`p-3 rounded-xl max-w-[85%] ${m.sender === "user" ? "bg-blue-600 ml-auto" : "bg-gray-800 mr-auto border border-gray-700"}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="p-3 bg-gray-800 rounded-xl mr-auto text-gray-400 animate-pulse">Thinking...</div>}
          </div>
          <form onSubmit={handleSend} className="p-3 bg-gray-800 rounded-b-2xl border-t border-gray-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about students, energy, exams..."
              className="flex-1 bg-gray-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
