#!/bin/bash
set -e

echo "🚀 Creating Sales CRM Analytics Dashboard..."

mkdir -p src/app/dashboard/leads/analytics

cat << 'EOL' > src/app/dashboard/leads/analytics/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function LeadsAnalyticsPage() {
  let leads: any[] = [];
  try {
    leads = await prisma.lead.findMany();
  } catch (err) {
    console.error("Failed to fetch leads for analytics:", err);
  }

  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.temperature.includes("Hot")).length;
  const warmLeads = leads.filter(l => l.temperature.includes("Warm")).length;
  const coldLeads = leads.filter(l => l.temperature.includes("Cold")).length;

  const totalStudentsReach = leads.reduce((acc, l) => acc + (l.studentStrength || 0), 0);
  const avgScore = totalLeads > 0 ? Math.round(leads.reduce((acc, l) => acc + l.score, 0) / totalLeads) : 0;

  const stages = {
    NEW: leads.filter(l => l.status === "NEW" || !l.status).length,
    CONTACTED: leads.filter(l => l.status === "CONTACTED").length,
    DEMO_BOOKED: leads.filter(l => l.status === "DEMO_BOOKED").length,
    WON: leads.filter(l => l.status === "WON").length,
  };

  const conversionRate = totalLeads > 0 ? ((stages.WON / totalLeads) * 100).toFixed(1) : "0";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM & Acquisition Analytics</h1>
          <p className="text-sm text-gray-500">Real-time performance metrics powered by SmartCampus AI Chatbot</p>
        </div>
        <div className="flex items-center space-x-3">
          <a href="/dashboard/leads" className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-700 shadow-sm transition-colors">
            View Leads Table
          </a>
          <a href="/dashboard/leads/kanban" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors">
            Open Kanban Board
          </a>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Inbound Leads</p>
          <div className="text-3xl font-bold text-gray-900">{totalLeads}</div>
          <p className="text-xs text-green-600 font-medium">⚡ Active acquisition pipeline</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Student Reach</p>
          <div className="text-3xl font-bold text-indigo-600">{totalStudentsReach.toLocaleString()}</div>
          <p className="text-xs text-gray-500 font-medium">Aggregate student body potential</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average Lead Score</p>
          <div className="text-3xl font-bold text-gray-900">{avgScore} <span className="text-sm font-normal text-gray-400">/ 100</span></div>
          <p className="text-xs text-indigo-600 font-medium">AI qualification metric</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Closed Won Rate</p>
          <div className="text-3xl font-bold text-green-600">{conversionRate}%</div>
          <p className="text-xs text-gray-500 font-medium">Pipeline conversion efficiency</p>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Temperature Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Lead Temperature Breakdown</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-red-600">🔥 Hot Leads</span>
                <span className="font-bold text-gray-700">{hotLeads}</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${totalLeads ? (hotLeads / totalLeads) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-orange-600">🟠 Warm Leads</span>
                <span className="font-bold text-gray-700">{warmLeads}</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${totalLeads ? (warmLeads / totalLeads) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-blue-600">🔵 Cold Leads</span>
                <span className="font-bold text-gray-700">{coldLeads}</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${totalLeads ? (coldLeads / totalLeads) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Stage Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Sales Pipeline Stage Funnel</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-xl border border-purple-100">
              <span className="font-semibold text-purple-900">✨ New Inbound</span>
              <span className="font-bold px-3 py-1 bg-white rounded-lg shadow-sm">{stages.NEW}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <span className="font-semibold text-blue-900">📞 Contacted</span>
              <span className="font-bold px-3 py-1 bg-white rounded-lg shadow-sm">{stages.CONTACTED}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50/50 rounded-xl border border-orange-100">
              <span className="font-semibold text-orange-900">📅 Demo Booked</span>
              <span className="font-bold px-3 py-1 bg-white rounded-lg shadow-sm">{stages.DEMO_BOOKED}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-xl border border-green-100">
              <span className="font-semibold text-green-900">🎉 Closed Won</span>
              <span className="font-bold px-3 py-1 bg-white rounded-lg shadow-sm">{stages.WON}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOL
echo "✨ Created Leads Analytics Dashboard at src/app/dashboard/leads/analytics/page.tsx!"
echo "🎉 CRM Analytics successfully installed!"
