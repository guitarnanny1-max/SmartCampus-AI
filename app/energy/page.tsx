import { prisma } from "@/lib/prisma";

export default async function EnergyPage() {
  const logs = await prisma.energyLog.findMany({
    include: { school: true },
    orderBy: { createdAt: "desc" }
  });

  const totalConsumption = logs.reduce((sum, l) => sum + l.powerKwh, 0);
  const optimalCount = logs.filter(l => l.status === "Optimal").length;

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full font-semibold border border-yellow-500/20">
            IoT Telemetry
          </span>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">Energy & Power Grid</h1>
          <p className="text-slate-400 text-sm mt-1">Monitor campus power consumption, smart grid efficiency, renewable generation, and HVAC nodes.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Power Draw</p>
          <p className="text-3xl font-black mt-2 text-yellow-400">{totalConsumption.toLocaleString()} kWh</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Monitored Facilities</p>
          <p className="text-3xl font-black mt-2 text-slate-100">{logs.length} Nodes</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Optimal Grid Status</p>
          <p className="text-3xl font-black mt-2 text-emerald-400">{optimalCount} / {logs.length} Active</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4">⚡ Campus Smart Grid Telemetry</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Location / Zone</th>
                <th className="py-3 px-4">Power Load (kWh)</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Grid Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {logs.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{item.location}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-yellow-400">{item.powerKwh} kWh</td>
                  <td className="py-3.5 px-4 text-slate-400">{item.school?.name}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      item.status === "Optimal" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-500">
                    No energy telemetry logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
