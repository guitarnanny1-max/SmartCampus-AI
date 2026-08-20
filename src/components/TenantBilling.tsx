export default function TenantBilling({
  schoolName,
  tier,
  currentStudents,
  maxStudents,
}: {
  schoolName: string;
  tier: string;
  currentStudents: number;
  maxStudents: number;
}) {
  const percentage = Math.min(Math.round((currentStudents / maxStudents) * 100), 100);

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              SUBSCRIPTION & METERING
            </span>
          </div>
          <h3 className="text-base font-bold text-white">Tier & Capacity Management</h3>
          <p className="text-xs text-slate-400">Current resource utilization for {schoolName}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            Tier: <strong className="text-cyan-400">{tier}</strong>
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Student Capacity Utilization</span>
          <span className="font-mono text-white font-semibold">
            {currentStudents} / {maxStudents} Enrolled ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              percentage > 90 ? 'bg-rose-500' : percentage > 75 ? 'bg-amber-500' : 'bg-cyan-500'
            }`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
