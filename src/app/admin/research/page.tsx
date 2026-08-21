export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ResearchInnovationPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-purple-200">
            Lincoln University Malaysia • PhD Track
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Research & Innovation Hub</h1>
          <p className="text-sm text-gray-500">Autonomous research management, literature reviews, methodology tracking, and publications</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
            🟢 Status: Active Candidature
          </span>
        </div>
      </div>

      {/* Research Profile Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold uppercase">Registered Research Topic</span>
            <div className="text-sm font-bold text-slate-900 mt-1">
              AI-Driven Multi-Tenant Architecture & Automated Acquisition in Educational ERP Systems
            </div>
            <span className="text-xs text-indigo-600 mt-2 block font-medium">Supervisor: Appointed Committee</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold uppercase">Candidature Milestone</span>
            <div className="text-sm font-bold text-slate-900 mt-1">Chapter 4: Empirical Evaluation & Results</div>
            <span className="text-xs text-green-600 mt-2 block font-medium">78% Thesis Completion</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold uppercase">Official Certification Note</span>
            <div className="text-xs text-slate-600 mt-1 leading-relaxed">
              *Note: Official degree certificates are issued exclusively by Lincoln University Malaysia upon board approval.
            </div>
          </div>
        </div>
      </div>

      {/* Research Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3">
          <h3 className="font-bold text-gray-900 text-base">📚 Literature & Proposal</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>Research Proposal</span>
              <span className="text-xs font-bold text-green-600">Approved</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>Literature Review</span>
              <span className="text-xs font-bold text-green-600">142 Sources</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Methodology Framework</span>
              <span className="text-xs font-bold text-indigo-600">Active</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3">
          <h3 className="font-bold text-gray-900 text-base">🔬 Experiments & Data</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>Multi-Tenant Benchmarks</span>
              <span className="text-xs font-bold text-purple-600">1.8M Requests</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>Ethics & Approvals</span>
              <span className="text-xs font-bold text-green-600">Cleared</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Supervisor Feedback</span>
              <span className="text-xs font-bold text-blue-600">3 Reviews Pending</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3">
          <h3 className="font-bold text-gray-900 text-base">📄 Publications & IP</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>Indexed Journals</span>
              <span className="text-xs font-bold text-indigo-600">3 Published</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>Conference Papers</span>
              <span className="text-xs font-bold text-indigo-600">2 Accepted</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Intellectual Property</span>
              <span className="text-xs font-bold text-green-600">2 Filed</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
