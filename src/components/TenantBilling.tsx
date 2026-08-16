'export default function TenantBilling({ 
  schoolName, 
  tier, 
  currentStudents, 
  maxStudents 
}: { 
  schoolName: string; 
  tier: string; 
  currentStudents: number; 
  maxStudents: number 
}) {
  const usagePercentage = Math.round((currentStudents / maxStudents) * 100);

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>💳</span> Tenant Subscription & Resource Metering
          </h3>
          <p className="text-xs text-slate-400">Active billing profile and license allocation for {schoolName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          tier === 'ENTERPRISE' 
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
        }`}>
          {tier} PLAN
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-300">
          <span>Student Roster Capacity Usage</span>
          <span className="font-mono text-cyan-400">{currentStudents} / {maxStudents} ({usagePercentage}%)</span>
        </div>
        <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
