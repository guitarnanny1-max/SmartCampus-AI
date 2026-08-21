#!/bin/bash
set -e

echo "🚀 Integrating AI Chat Widget & Creating CRM Leads Dashboard..."

# 1. Update src/app/layout.tsx to include AIChatWidget
LAYOUT_PATH="src/app/layout.tsx"
if [ -f "$LAYOUT_PATH" ]; then
    # Check if AIChatWidget is already imported
    if ! grep -q "AIChatWidget" "$LAYOUT_PATH"; then
        python3 -c '
path = "src/app/layout.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Add import
import_statement = "import AIChatWidget from \"@/components/AIChatWidget\";\n"
content = import_statement + content

# Add component before closing body or html tag
if "</body>" in content:
    content = content.replace("</body>", "  <AIChatWidget />\n</body>")
elif "</html>" in content:
    content = content.replace("</html>", "  <AIChatWidget />\n</html>")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
'
        echo "✨ Injected AIChatWidget into src/app/layout.tsx"
    else
        echo "ℹ️ AIChatWidget already present in layout.tsx"
    fi
else
    echo "⚠️ src/app/layout.tsx not found, skipping layout injection."
fi

# 2. Create CRM Leads Dashboard Page
mkdir -p src/app/dashboard/leads
cat << 'EOL' > src/app/dashboard/leads/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function LeadsDashboardPage() {
  let leads = [];
  try {
    leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    console.error("Failed to fetch leads from CRM:", err);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales CRM & Inbound Leads</h1>
          <p className="text-sm text-gray-500">Automated capture pipeline powered by SmartCampus AI Chatbot</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold border border-red-200">
            🔥 Hot: {leads.filter((l: any) => l.temperature.includes("Hot")).length}
          </span>
          <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold border border-orange-200">
            🟠 Warm: {leads.filter((l: any) => l.temperature.includes("Warm")).length}
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
            🔵 Cold: {leads.filter((l: any) => l.temperature.includes("Cold")).length}
          </span>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
                <th className="py-3 px-4 font-semibold">Temperature</th>
                <th className="py-3 px-4 font-semibold">Visitor / School</th>
                <th className="py-3 px-4 font-semibold">Contact Info</th>
                <th className="py-3 px-4 font-semibold">Students</th>
                <th className="py-3 px-4 font-semibold">Interest</th>
                <th className="py-3 px-4 font-semibold">Score</th>
                <th className="py-3 px-4 font-semibold">Captured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    No leads captured yet. Interact with the website AI Chat widget to test the pipeline!
                  </td>
                </tr>
              ) : (
                leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 border border-gray-200">
                        {lead.temperature}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{lead.name}</div>
                      <div className="text-xs text-gray-500">{lead.school} ({lead.location || 'N/A'})</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900">{lead.email}</div>
                      <div className="text-xs text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {lead.studentStrength ? lead.studentStrength.toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                      {lead.interest || 'General Inquiry'}
                    </td>
                    <td className="py-3 px-4 font-bold text-indigo-600">
                      {lead.score} / 100
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
EOL
echo "✨ Created src/app/dashboard/leads/page.tsx successfully!"

# 3. Run prisma push or generate to ensure database tables match schema
echo "⚙️ Running npx prisma db push..."
npx prisma db push --skip-generate

echo "🎉 AI Acquisition Engine fully installed and connected!"
