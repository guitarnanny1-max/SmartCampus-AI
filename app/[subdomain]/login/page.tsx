"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage(props: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = use(props.params);
  const router = useRouter();
  const [email, setEmail] = useState(`student@${subdomain}.com`);
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, subdomain }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("smartcampus_user", JSON.stringify(data.user));
        const role = data.user.role;
        if (role === "ADMIN") router.push(`/${subdomain}/admin`);
        else if (role === "PARENT") router.push(`/${subdomain}/parent`);
        else if (role === "TEACHER") router.push(`/${subdomain}/teacher`);
        else router.push(`/${subdomain}/student`);
      } else {
        setError(data.error || "Authentication failed.");
      }
    } catch (err: any) {
      setError(err.message || "Network error during login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">SmartCampus Cloud ERP</span>
          <h1 className="text-2xl font-black">Workspace Login ({subdomain})</h1>
          <p className="text-xs text-slate-400">Authenticate securely to access your role-based portal.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50 text-sm"
          >
            {loading ? "Authenticating..." : "Secure Login"}
          </button>
        </form>

        <div className="border-t border-slate-800 pt-4 space-y-2">
          <p className="text-[10px] font-mono text-slate-500 uppercase text-center">Quick Demo Credentials (Password: password123)</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button type="button" onClick={() => setEmail(`admin@${subdomain}.com`)} className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 font-mono cursor-pointer">
              👑 Admin
            </button>
            <button type="button" onClick={() => setEmail(`parent@${subdomain}.com`)} className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 font-mono cursor-pointer">
              👨‍👩‍👦 Parent
            </button>
            <button type="button" onClick={() => setEmail(`teacher@${subdomain}.com`)} className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 font-mono cursor-pointer">
              👩‍🏫 Teacher
            </button>
            <button type="button" onClick={() => setEmail(`student@${subdomain}.com`)} className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 font-mono cursor-pointer">
              🎓 Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
