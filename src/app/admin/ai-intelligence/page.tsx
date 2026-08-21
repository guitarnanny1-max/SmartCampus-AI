export const revalidate = 0;
export const dynamic = 'force-dynamic';
"use client";

import { useEffect, useState } from "react";
import { Sparkles, BrainCircuit, Mail, Copy, Check, ArrowRight, ShieldCheck, Zap } from "lucide-react";

type Lead = {
  id: string;
  fullName: string;
  schoolName: string;
  email: string;
  studentCount: string;
  requirements: string;
  status: string;
};

export default function AIIntelligencePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [generating, setGenerating] = useState(false);
  const [draftEmail, setDraftEmail] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.leads.length > 0) {
          setLeads(data.leads);
          setSelectedLead(data.leads[0]);
          generateDraft(data.leads[0]);
        }
      })
      .catch((err) => console.error("Error fetching leads:", err));
  }, []);

  const generateDraft = (lead: Lead) => {
    setGenerating(true);
    setTimeout(() => {
      const draft = `Subject: Tailored SmartCampus AI & SIS Integration Plan for ${lead.schoolName}

Dear ${lead.fullName},

Thank you for your interest in ThomasG Cloud SmartCampus. Based on your institutional size (${lead.studentCount}) and your specific focus on "${lead.requirements || "comprehensive campus automation"}", our neural architecture team has prepared a custom deployment roadmap.

Key Modules Recommended for ${lead.schoolName}:
1. Automated Tuition Reconciliation & Billing Engine
2. Biometric Real-Time Attendance Sync
3. Secure Multi-Campus Cloud Administration Portal

We would love to host a secure sandbox walkthrough tailored to your administrative workflow this week. Please let us know your availability for a 20-minute session.

Best regards,

ThomasG Cloud Enterprise Solutions
SmartCampus AI Intelligence Division`;

      setDraftEmail(draft);
      setGenerating(false);
    }, 400);
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    generateDraft(lead);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draftEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#e8d0a9]" /> AI Intelligence Suite
          </h1>
          <p className="text-xs text-slate-400">Autonomous institutional lead scoring and personalized outreach generation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Selector Sidebar */}
        <div className="rounded-2xl border border-white/10 bg-[#16102f] p-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 px-2">Select Prospect Lead</h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {leads.map((lead: any) => (
              <button
                key={lead.id}
                onClick={() => handleSelectLead(lead)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedLead?.id === lead.id
                    ? "bg-[#e8d0a9]/10 border-[#e8d0a9]/40 text-white shadow-md"
                    : "bg-[#1f173d]/50 border-white/5 text-slate-300 hover:bg-[#1f173d]"
                }`}
              >
                <div className="font-bold text-xs text-white">{lead.schoolName}</div>
                <div className="text-[11px] text-slate-400">{lead.fullName}</div>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-[#e8d0a9] font-mono">{lead.studentCount}</span>
                  <span className="text-slate-400">{lead.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Generator Panel */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#16102f] p-6 space-y-6">
          {selectedLead ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#e8d0a9] bg-[#e8d0a9]/10 px-3 py-1 rounded-full border border-[#e8d0a9]/20">
                    Neural Intent Analysis
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{selectedLead.schoolName}</h3>
                  <p className="text-xs text-slate-400">Primary Contact: {selectedLead.fullName} ({selectedLead.email})</p>
                </div>
                <div className="bg-[#1f173d] p-3 rounded-xl border border-white/10 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Intent Score</div>
                  <div className="text-xl font-black text-[#e8d0a9]">94 / 100</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <BrainCircuit className="h-4 w-4 text-[#e8d0a9]" /> Generated Outreach Draft
                  </h4>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied to Clipboard" : "Copy Draft"}
                  </button>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#1f173d] p-4 font-mono text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                  {generating ? "Synthesizing AI outreach draft..." : draftEmail}
                </div>
              </div>

              <div className="rounded-xl bg-[#e8d0a9]/5 border border-[#e8d0a9]/20 p-4 flex items-center gap-3">
                <Zap className="h-5 w-5 text-[#e8d0a9] shrink-0" />
                <p className="text-xs text-slate-300">
                  This draft is automatically contextualized using the institution's stated student count and specific requirements. You can copy and send directly via your email client.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">Select a lead from the sidebar to view AI insights.</div>
          )}
        </div>
      </div>
    </div>
  );
}
