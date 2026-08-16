"use client";

import { useState } from "react";
import { updateLeadStatus } from "@/app/admin/leads/actions";
import { Loader2, ChevronDown } from "lucide-react";

interface LeadStatusSelectorProps {
  leadId: string;
  currentStatus: string;
}

const statuses = ["NEW", "CONTACTED", "DEMO_SCHEDULED", "CONVERTED", "CLOSED"];

export default function LeadStatusSelector({ leadId, currentStatus }: LeadStatusSelectorProps) {
  const [status, setStatus] = useState(currentStatus || "NEW");
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value;
    setStatus(nextStatus);
    setLoading(true);

    const result = await updateLeadStatus(leadId, nextStatus);
    if (!result.success) {
      alert(`Error updating status: ${result.error}`);
      setStatus(currentStatus);
    }
    setLoading(false);
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className="appearance-none rounded-xl border border-white/10 bg-[#1f173d] px-3 py-1.5 pr-7 text-[10px] font-bold text-white uppercase tracking-wider outline-none focus:border-[#e8d0a9] cursor-pointer disabled:opacity-50"
      >
        {statuses.map((s) => (
          <option key={s} value={s} className="bg-[#16102f] text-white">
            {s.replace("_", " ")}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 flex items-center text-slate-400">
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ChevronDown className="h-3 w-3" />}
      </div>
    </div>
  );
}
