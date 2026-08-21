export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function EvidenceVaultPage() {
  const evidenceCategories = [
    { title: "📸 Product Screenshots", count: "48 Artifacts", desc: "High-resolution UI captures of ERP modules, AI Chat, and CRM." },
    { title: "🏛️ Architecture Blueprints", count: "12 Diagrams", desc: "Multi-tenant isolation, database schemas, and AI pipeline flow." },
    { title: "🚀 Release History", count: "v3.4.0 Live", desc: "Changelogs, deployment velocity, and uptime records." },
    { title: "💬 Customer Testimonials", count: "34 Schools", desc: "Principal and administrator reviews across 18 states." },
    { title: "📊 Usage & Impact Metrics", count: "1.8M AI Calls", desc: "Quantifiable administrative time saved and conversion lift." },
    { title: "📑 Case Studies", count: "6 Published", desc: "Deep-dive ROI reports on institutional digital transformation." },
    { title: "🔬 Research Papers", count: "3 Papers", desc: "Peer-reviewed publications supporting platform innovations." },
    { title: "🏆 Awards & Recognition", count: "5 Nominations", desc: "EdTech innovation and entrepreneurship accolades." },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-amber-200">
            Global Recognition & Compliance
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Awards & Evidence Vault</h1>
          <p className="text-sm text-gray-500">Auditable repository of product milestones, research, customer metrics, and IP for award submissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-200">
            🔒 Secure Vault Storage
          </span>
        </div>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {evidenceCategories.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                {item.count}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <span className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer">
                View Repository &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
