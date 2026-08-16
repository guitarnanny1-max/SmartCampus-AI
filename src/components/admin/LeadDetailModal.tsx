"use client";

import { useState } from "react";
import { updateLeadDetails } from "@/app/admin/leads/actions";
import { X, Save, Loader2, Sparkles, FileText, Flame } from "lucide-react";

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

interface LeadDetailModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadDetailModal({ lead, isOpen, onClose }: LeadDetailModalProps) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [priority, setPriority] = useState(lead.priority || "MEDIUM");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");

    const res = await updateLeadDetails(lead.id, { notes, priority });
    setSaving(false);

    if (res.success) {
      setSuccessMessage("Lead updated successfully!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      alert(`Error updating lead: ${res.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-3xl border border-[#e8d0a9]/30 bg-[#16102f] p-6 sm:p-8 shadow-2xl space-y-6 text-white animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e8d0a9]/30 bg-[#1f153f] px-3 py-1 text-[10px] font-semibold text-[#e8d0a9] uppercase tracking-wider mb-1">
              <Sparkles className="h-3 w-3" /> Lead Management View
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">{lead.school_name}</h2>
            <p className="text-xs text-slate-400">Contact: {lead.contact_name} ({lead.contact_email})</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Details */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl border border-white/10 bg-[#1f173d] p-3 space-y-1">
              <span className="text-slate-400 font-medium">Phone Number</span>
              <div className="font-bold text-white text-sm">{lead.contact_phone}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1f173d] p-3 space-y-1">
              <span className="text-slate-400 font-medium">Student Strength</span>
              <div className="font-bold text-[#e8d0a9] text-sm">{lead.student_count ? `${lead.student_count} Students` : "Not specified"}</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-[#e8d0a9]" /> Priority Classification
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#1f173d] py-3 px-4 text-xs font-bold text-white uppercase tracking-wider outline-none focus:border-[#e8d0a9]"
            >
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#e8d0a9]" /> Internal Notes & Requirements
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes, call logs, or specific institutional requirements..."
              className="w-full rounded-xl border border-white/10 bg-[#1f173d] p-4 text-xs text-white placeholder-slate-500 outline-none focus:border-[#e8d0a9] leading-relaxed resize-none"
            />
          </div>

          {successMessage && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300 font-semibold text-center">
              {successMessage}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-transparent px-5 py-3 text-xs font-bold text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#e8d0a9] px-6 py-3 text-xs font-bold text-black hover:bg-white transition-colors disabled:opacity-50 shadow-lg"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
