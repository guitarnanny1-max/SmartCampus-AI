import { prisma } from "@/lib/prisma";

export default async function TransportPage() {
  const buses = await prisma.school.findMany({ include: { students: true } });
  
  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full font-semibold border border-teal-500/20">
            Fleet Intelligence
          </span>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">Transport & Fleet Management</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time GPS tracking, route optimization, and student bus transit telemetry.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Fleet Buses</p>
          <p className="text-3xl font-black mt-2 text-teal-400">4 Units</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">GPS Routing Status</p>
          <p className="text-3xl font-black mt-2 text-emerald-400">100% Online</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Students Enrolled in Bus</p>
          <p className="text-3xl font-black mt-2 text-blue-400">142 Riders</p>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4">🚌 Active Route Roster</h3>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <span className="text-xs font-mono text-teal-400">ROUTE #101 - NORTH ZONE</span>
            <p className="font-semibold text-slate-200 mt-1">Global Tech Academy Express</p>
            <p className="text-xs text-slate-400 mt-0.5">Driver: Rajesh Kumar • GPS Beacon: Active</p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/20">On Schedule</span>
        </div>
      </div>
    </div>
  );
}
