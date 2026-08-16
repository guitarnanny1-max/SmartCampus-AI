"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Download, MoreVertical, CheckCircle2, Clock, AlertCircle, Trash2, ArrowUpRight } from "lucide-react";

type Lead = {
  id: string;
  fullName: string;
  schoolName: string;
  email: string;
  phone: string;
  studentCount: string;
  status: string;
  createdAt: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success) setLeads(data.leads);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      fetchLeads();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const exportCSV = () => {
    const csv = [
      ["ID", "Name", "School", "Email", "Phone", "Status", "Created At"],
      ...leads.map(l => [l.id, l.fullName, l.schoolName, l.email, l.phone, l.status, l.createdAt])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_export_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const filteredLeads = leads.filter(l => 
    l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">CRM Pipeline</h1>
          <p className="text-xs text-slate-400">Managing {leads.length} active institutional prospects.</p>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 transition-colors"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV Data
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#16102f] p-5">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">New Leads</p>
          <h3 className="text-2xl font-black text-white">{leads.filter(l => l.status === "New Lead").length}</h3>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#16102f] p-5">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Demo Scheduled</p>
          <h3 className="text-2xl font-black text-[#e8d0a9]">{leads.filter(l => l.status === "Demo Scheduled").length}</h3>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#16102f] p-5">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Pipeline</p>
          <h3 className="text-2xl font-black text-white">{leads.length}</h3>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search leads by name or institution..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#16102f] py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-[#e8d0a9]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#16102f] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-bold text-slate-300">Lead Information</th>
              <th className="p-4 font-bold text-slate-300">Contact</th>
              <th className="p-4 font-bold text-slate-300">Enrollment</th>
              <th className="p-4 font-bold text-slate-300">Status</th>
              <th className="p-4 font-bold text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading Pipeline...</td></tr>
            ) : filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-white">{lead.fullName}</div>
                  <div className="text-slate-400">{lead.schoolName}</div>
                </td>
                <td className="p-4 text-slate-300">{lead.email}</td>
                <td className="p-4 text-slate-300">{lead.studentCount}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    lead.status === "New Lead" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                    lead.status === "Demo Scheduled" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {lead.status === "New Lead" && <AlertCircle className="h-3 w-3" />}
                    {lead.status === "Demo Scheduled" && <CheckCircle2 className="h-3 w-3" />}
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <select 
                    className="bg-[#1f173d] border border-white/10 rounded-lg p-1.5 text-xs text-white cursor-pointer"
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                  >
                    <option value="New Lead">New Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Demo Scheduled">Demo Scheduled</option>
                    <option value="Closed/Won">Closed/Won</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
