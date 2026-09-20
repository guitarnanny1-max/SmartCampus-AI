"use client";
export const dynamic = "force-dynamic";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ParentApp(props: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = use(props.params);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tenantId, setTenantId] = useState("");
  const [bus, setBus] = useState<any>({ busNumber: "Bus #4 (Route A)", status: "On Time - 8 mins to Campus", speed: "42 km/h" });
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [paying, setPaying] = useState(false);
  const [paidStatus, setPaidStatus] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("smartcampus_user");
    if (!storedUser) {
      router.push(`/${subdomain}/login`);
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    async function init() {
      try {
        const res = await fetch(`/api/messages/tenant-lookup?subdomain=${subdomain}`);
        const data = await res.json();
        if (data.tenantId) {
          setTenantId(data.tenantId);
          // Fetch messages
          const msgRes = await fetch(`/api/messages?tenantId=${data.tenantId}`);
          const msgData = await msgRes.json();
          if (msgData.success) setMessages(msgData.messages);
        }
      } catch (e) {}
    }
    init();
  }, [subdomain, router]);

  function handleLogout() {
    localStorage.removeItem("smartcampus_user");
    router.push(`/${subdomain}/login`);
  }

  async function handlePayment() {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaidStatus(true);
    }, 1500);
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !tenantId) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, senderName: user.name || "Mr. Gupta", senderRole: "PARENT", content: newMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages([data.message, ...messages]);
        setNewMessage("");
      }
    } catch (e) {}
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center shadow-xl">
          <div>
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Parent Companion Workspace</span>
            <h1 className="text-3xl font-black mt-1">Parent Portal ({subdomain})</h1>
            <p className="text-sm text-slate-400">Monitor fee payments, school bus GPS telemetry, and communicate with educators.</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-bold uppercase">Role: {user.role} ({user.name})</span>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold uppercase transition cursor-pointer">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Fee Payment & Bus Telemetry */}
          <div className="space-y-6">
            {/* Fee Payment Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Term Fee Checkout</h3>
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">Razorpay Secure</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-semibold text-slate-200">Rahul Gupta (10-A)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Q2 Tuition Fee:</span>
                  <span className="font-bold text-emerald-400">₹25,000</span>
                </div>
                {paidStatus ? (
                  <div className="w-full py-3 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-center text-xs font-bold uppercase">
                    Paid Successfully ✓
                  </div>
                ) : (
                  <button 
                    onClick={handlePayment} 
                    disabled={paying}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
                  >
                    {paying ? "Processing Razorpay..." : "Pay ₹25,000 Now"}
                  </button>
                )}
              </div>
            </div>

            {/* School Bus GPS Telemetry */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Live School Bus GPS</h3>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 animate-pulse">Live Tracking</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Bus Assigned:</span>
                  <span className="text-slate-200 font-bold">{bus.busNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Status:</span>
                  <span className="text-emerald-400 font-bold">{bus.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Speed:</span>
                  <span className="text-cyan-400 font-bold">{bus.speed}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Parent-Teacher Communication */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between h-[600px] shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-lg">Parent-Teacher Comms</h3>
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">Direct Channel</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">Direct secure communication channel with homeroom educators and administration.</p>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex-1 overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-10">No messages yet. Send a note to the teachers below.</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`p-3.5 rounded-xl border max-w-[85%] ${msg.senderRole === 'PARENT' ? 'ml-auto bg-indigo-600/20 border-indigo-500/30 text-right' : 'bg-slate-900 border-slate-800'}`}>
                    <p className="text-[10px] font-bold text-indigo-400">{msg.senderName} ({msg.senderRole})</p>
                    <p className="text-sm text-slate-200 mt-1 leading-relaxed">{msg.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message Dr. Sharma or School Admin..." 
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition shadow-lg cursor-pointer">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}