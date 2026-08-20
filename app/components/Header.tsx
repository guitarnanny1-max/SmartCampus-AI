'use client';

import { useState } from "react";

export default function Header() {
  const [currentRole, setCurrentRole] = useState("Super Admin");

  const roles = [
    { name: "Super Admin", badge: "bg-red-500/10 text-red-400 border-red-500/20" },
    { name: "Campus Principal", badge: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { name: "Finance Officer", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { name: "Teacher", badge: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  ];

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-8 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Active Session:</span>
        <select
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
          className="bg-slate-950 text-slate-100 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {roles.map((r) => (
            <option key={r.name} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-slate-200">Dr. Aris Thorne</p>
          <p className="text-[10px] text-slate-400">aris.thorne@smartcampus.ai</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-blue-600/20">
          AT
        </div>
      </div>
    </header>
  );
}
