'use client';

export default function ExportReports() {
  const handleExport = (type: string) => {
    window.location.href = `/api/export-csv?type=${type}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button 
        onClick={() => handleExport('students')}
        className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5"
      >
        <span>📥 Students CSV</span>
      </button>
      <button 
        onClick={() => handleExport('facilities')}
        className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5"
      >
        <span>📥 Facilities CSV</span>
      </button>
      <button 
        onClick={() => handleExport('placements')}
        className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5"
      >
        <span>📥 Placements CSV</span>
      </button>
    </div>
  );
}
