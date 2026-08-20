const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const targetDir = "src/app/hr";
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const pageContent = `'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Award, 
  FileText, 
  CheckCircle2,
  Search
} from 'lucide-react';
import Link from 'next/link';

export default function HRPortal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [staff] = useState([
    { id: 1, name: 'Dr. Robert Langdon', role: 'Department Chair (Physics)', department: 'Science', status: 'Active', attendance: 'Present' },
    { id: 2, name: 'Prof. Eleanor Vance', role: 'Senior Lecturer', department: 'Mathematics', status: 'Active', attendance: 'Present' },
    { id: 3, name: 'Marcus Brody', role: 'Administrator', department: 'Operations', status: 'On Leave', attendance: 'Leave' },
    { id: 4, name: 'Sarah Jenkins', role: 'Counselor', department: 'Student Welfare', status: 'Active', attendance: 'Present' }
  ]);

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono rounded-full uppercase">
                Portal: Human Resources & Faculty
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">Staff Directory & Payroll 👥</h1>
            <p className="text-slate-400 text-sm">Delhi Public School • Faculty Management & Attendance</p>
          </div>
          <div className="flex gap-3">
             <Link href="/dashboard" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-colors">
                Master Hub
             </Link>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span className="text-xs text-slate-400 font-mono">Total Staff</span>
            </div>
            <span className="text-2xl font-bold text-white">142</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-slate-400 font-mono">Present Today</span>
            </div>
            <span className="text-2xl font-bold text-emerald-400">134</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-slate-400 font-mono">Departments</span>
            </div>
            <span className="text-2xl font-bold text-white">8</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span className="text-xs text-slate-400 font-mono">On Leave</span>
            </div>
            <span className="text-2xl font-bold text-amber-400">8</span>
          </div>
        </div>

        {/* Staff Table Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Faculty & Staff Roster
            </h2>
            <div className="flex items-center bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl w-full md:w-72">
              <Search className="w-4 h-4 text-slate-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search staff or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-xs focus:outline-none text-slate-200 w-full placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase font-mono">
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-sm text-slate-200">{member.name}</td>
                    <td className="py-3 px-4 text-xs text-slate-400">{member.role}</td>
                    <td className="py-3 px-4 text-xs text-indigo-400 font-medium">{member.department}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-300">
                      {member.attendance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(targetDir, "page.tsx"), pageContent, "utf8");
console.log("✅ Created hr/page.tsx with Human Resources Portal!");

try {
  console.log("🏗️ Running build verification...");
  execSync("npm run build", { stdio: "inherit" });
  console.log("✅ HR Portal built successfully!");
} catch (e) {
  console.error("❌ Build failed.");
  process.exit(1);
}
