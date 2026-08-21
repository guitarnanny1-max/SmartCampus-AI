#!/bin/bash
set -e

echo "🚀 Creating Sales CRM Kanban Board..."

mkdir -p src/components
mkdir -p src/app/dashboard/leads/kanban

# 1. Create LeadKanbanBoard Client Component
cat << 'EOL' > src/components/LeadKanbanBoard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  name: string;
  school: string;
  phone: string;
  email: string;
  studentStrength?: number | null;
  location?: string | null;
  interest?: string | null;
  score: number;
  temperature: string;
  status: string;
  createdAt: string;
}

const STAGES = [
  { key: "NEW", label: "✨ New Inbound", color: "border-purple-200 bg-purple-50/50" },
  { key: "CONTACTED", label: "📞 Contacted", color: "border-blue-200 bg-blue-50/50" },
  { key: "DEMO_BOOKED", label: "📅 Demo Booked", color: "border-orange-200 bg-orange-50/50" },
  { key: "WON", label: "🎉 Closed Won", color: "border-green-200 bg-green-50/50" },
];

export default function LeadKanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    try {
      const res = await fetch("/api/chat/lead", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
        );
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update lead status", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {STAGES.map((stage) => {
        const columnLeads = leads.filter((l) => (l.status || "NEW") === stage.key);

        return (
          <div key={stage.key} className={`rounded-2xl border ${stage.color} p-4 flex flex-col h-[700px]`}>
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60">
              <h3 className="font-bold text-gray-800 text-sm">{stage.label}</h3>
              <span className="bg-white px-2.5 py-0.5 rounded-full text-xs font-bold text-gray-600 shadow-sm border border-gray-200">
                {columnLeads.length}
              </span>
            </div>

            {/* Leads Column Cards */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {columnLeads.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs italic">
                  No leads in this stage
                </div>
              ) : (
                columnLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/80 hover:shadow-md transition-shadow space-y-3"
                  >
                    {/* Top Row: Temp & Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 border border-gray-200">
                        {lead.temperature}
                      </span>
                      <span className="text-xs font-bold text-indigo-600">
                        {lead.score} pts
                      </span>
                    </div>

                    {/* School & Contact */}
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{lead.school}</h4>
                      <p className="text-xs text-gray-500">{lead.name} • {lead.location || "N/A"}</p>
                      <p className="text-xs text-indigo-600 mt-1 font-medium">{lead.email}</p>
                    </div>

                    {/* Interest & Strength */}
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <div><strong className="text-gray-700">Students:</strong> {lead.studentStrength || "N/A"}</div>
                      <div className="truncate"><strong className="text-gray-700">Interest:</strong> {lead.interest || "General"}</div>
                    </div>

                    {/* Stage Shift Actions */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-400">Move to:</span>
                      <select
                        value={lead.status || "NEW"}
                        disabled={loadingId === lead.id}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs font-medium text-gray-700 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="DEMO_BOOKED">Demo Booked</option>
                        <option value="WON">Closed Won</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
EOL
echo "✨ Created LeadKanbanBoard.tsx component!"

{
  echo "export const dynamic = 'force-dynamic';"
  echo "export const revalidate = 0;"
  echo ""
  echo "import { PrismaClient } from '@prisma/client';"
  echo "import LeadKanbanBoard from '@/components/LeadKanbanBoard';"
  echo ""
  echo "const prisma = new PrismaClient();"
  echo ""
  echo "export default async function KanbanPage() {"
  echo "  let leads = [];"
  echo "  try {"
  echo "    leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });"
  echo "  } catch (err) {"
  echo "    console.error('Failed to load CRM Kanban leads:', err);"
  echo "  }"
  echo ""
  echo "  // Serialize dates for client component"
  echo "  const serializedLeads = leads.map((l: any) => ({"
  echo "    ...l,"
  echo "    createdAt: l.createdAt.toISOString(),"
  echo "  }));"
  echo ""
  echo "  return ("
  echo "    <div className='p-6 max-w-7xl mx-auto space-y-6'>"
  echo "      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>"
  echo "        <div>"
  echo "          <h1 className='text-2xl font-bold text-gray-900'>Sales CRM Pipeline Kanban</h1>"
  echo "          <p className='text-sm text-gray-500'>Manage and advance inbound school leads across sales stages</p>"
  echo "        </div>"
  echo "        <div className='flex items-center space-x-3'>"
  echo "          <a href='/dashboard/leads' className='px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-700 shadow-sm transition-colors'>"
  echo "            Switch to Table View"
  echo "          </a>"
  echo "        </div>"
  echo "      </div>"
  echo "      <LeadKanbanBoard initialLeads={serializedLeads} />"
  echo "    </div>"
  echo "  );"
  echo "}"
} > src/app/dashboard/leads/kanban/page.tsx

echo "✨ Created Kanban Page at src/app/dashboard/leads/kanban/page.tsx!"
echo "🎉 CRM Kanban Board successfully set up!"
