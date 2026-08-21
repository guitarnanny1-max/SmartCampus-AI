export const dynamic = 'force-dynamic';

export default function DepartmentPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-indigo-200">
          Super Admin Department Command Center
        </span>
        <h1 className="text-3xl font-bold text-gray-900 capitalize">thomasg Hub</h1>
        <p className="text-gray-600 text-base">
          Dedicated operational metrics, telemetry, tools, and management consoles for the thomasg division of SmartCampus AI.
        </p>
        <div className="pt-4 flex gap-4">
          <a href="/admin/tenants" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors">
            Return to Executive Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
