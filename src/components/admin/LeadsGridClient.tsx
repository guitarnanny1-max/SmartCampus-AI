"use client";

import { useState, useMemo } from "react";
import { Mail, Phone, Users, Calendar, Search, Download, Filter, Flame, Edit3 } from "lucide-react";
import LeadStatusSelector from "@/components/admin/LeadStatusSelector";
import LeadDetailModal from "@/components/admin/LeadDetailModal";

interface Lead {
  id: string;
  school_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status?: string;
  lead_status?: string;
  priority?: string;
  student_count?: number;
  notes?: string;
  created_at: string;
  source?: string;
}

interface LeadsGridClientProps {
  initialLeads: Lead[];
}

export default function LeadsGridClient({ initialLeads }: LeadsGridClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    return initialLeads.filter((lead: any) => {
      const currentStatus = lead.status || lead.lead_status || "NEW";
      const currentPriority = lead.priority || "MEDIUM";

      const matchesStatus = statusFilter === "ALL" || currentStatus === statusFilter;
      const matchesPriority = priorityFilter === "ALL" || currentPriority === priorityFilter;
      
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        lead.school_name.toLowerCase().includes(query) ||
        lead.contact_name.toLowerCase().includes(query) ||
        lead.contact_email.toLowerCase().includes(query);

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [initialLeads, searchQuery, statusFilter, priorityFilter]);

  const exportToCSV = () => {
    const headers = ["School Name,Contact Name,Email,Phone,Status,Priority,Student Count,Created At,Notes"];
    const rows = filteredLeads.map((l: any) => [
      `"${l.school_name}"`,
      `"${l.contact_name}"`,
      `"${l.contact_email}"`,
      `"${l.contact_phone}"`,
      `"${l.status || l.lead_status || "NEW"}"`,
      `"${l.priority || "MEDIUM"}"`,
      l.student_count || "",
      `"${new Date(l.created_at).toLocaleDateString()}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
    ].join(","));

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smartcampus_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search, Filters, Export */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#16102f] p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by school, contact, or email..."
              className="w-full rounded-2xl border border-white/10 bg-[#1f173d] py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-[#e8d0a9]"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <div className="absolute left-3.5 top-3.5 pointer-events-none text-slate-400">
                <Filter className="h-4 w-4" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-[#1f173d] py-3 pl-10 pr-8 text-xs font-semibold text-white uppercase tracking-wider outline-none focus:border-[#e8d0a9] cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="DEMO_SCHEDULED">Demo Scheduled</option>
                <option value="CONVERTED">Converted</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div className="relative flex-1 sm:flex-initial">
              <div className="absolute left-3.5 top-3.5 pointer-events-none text-slate-400">
                <Flame className="h-4 w-4" />
              </div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-[#1f173d] py-3 pl-10 pr-8 text-xs font-semibold text-white uppercase tracking-wider outline-none focus:border-[#e8d0a9] cursor-pointer"
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={exportToCSV}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#e8d0a9] px-5 py-3 text-xs font-bold text-black hover:bg-white transition-colors shadow-lg shrink-0"
        >
          <Download className="h-4 w-4" />
          Export CSV ({filteredLeads.length})
        </button>
      </div>

      {/* Leads Grid */}
      {filteredLeads.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#16102f] p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-slate-400">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold">No matching leads found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, status, or priority filter to find what you are looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead: any) => {
            const priority = lead.priority || "MEDIUM";
            const priorityBadgeStyle =
              priority === "HIGH"
                ? "bg-red-500/20 text-red-300 border-red-500/30"
                : priority === "LOW"
                ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                : "bg-[#e8d0a9]/20 text-[#e8d0a9] border-[#e8d0a9]/30";

            return (
              <div
                key={lead.id}
                className="group relative rounded-3xl border border-[#e8d0a9]/20 bg-[#16102f] p-6 shadow-xl transition-all hover:border-[#e8d0a9]/50 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-1.5 ${priorityBadgeStyle}`}>
                        <Flame className="h-2.5 w-2.5" /> {priority}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-[#e8d0a9] transition-colors">
                        {lead.school_name}
                      </h3>
                    </div>
                    <LeadStatusSelector leadId={lead.id} currentStatus={lead.status || lead.lead_status || "NEW"} />
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">Contact:</span> {lead.contact_name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-[#e8d0a9]" />
                      <a href={`mailto:${lead.contact_email}`} className="hover:underline text-slate-200">
                        {lead.contact_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-[#e8d0a9]" />
                      <a href={`tel:${lead.contact_phone}`} className="hover:underline text-slate-200">
                        {lead.contact_phone}
                      </a>
                    </div>
                    {lead.student_count && (
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-[#e8d0a9]" />
                        <span>Strength: {lead.student_count} Students</span>
                      </div>
                    )}
                  </div>

                  {lead.notes && (
                    <div className="rounded-2xl border border-white/5 bg-[#1f173d] p-3 text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed line-clamp-3">
                      <span className="block font-semibold text-[#e8d0a9] mb-1">Notes / Requirements:</span>
                      {lead.notes}
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    {new Date(lead.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  
                  <button
                    onClick={() => setSelectedLead(lead)}
                    className="flex items-center gap-1.5 rounded-xl border border-[#e8d0a9]/30 bg-[#1f153f] px-3 py-1.5 font-bold text-[#e8d0a9] hover:bg-[#e8d0a9] hover:text-black transition-all"
                  >
                    <Edit3 className="h-3 w-3" /> Edit Notes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
