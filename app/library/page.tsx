import { prisma } from "@/lib/prisma";

export default async function LibraryPage() {
  const assets = await prisma.libraryAsset.findMany({
    include: { school: true },
    orderBy: { createdAt: "desc" }
  });

  const availableCount = assets.filter(a => a.status === "Available").length;
  const borrowedCount = assets.filter(a => a.status === "Borrowed").length;

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full font-semibold border border-indigo-500/20">
            Resource Inventory
          </span>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">Library & Asset Management</h1>
          <p className="text-slate-400 text-sm mt-1">Track textbooks, laboratory hardware, digital devices, and resource checkout logs.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Catalog Assets</p>
          <p className="text-3xl font-black mt-2 text-slate-100">{assets.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Available on Shelf</p>
          <p className="text-3xl font-black mt-2 text-emerald-400">{availableCount}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Checked Out / Borrowed</p>
          <p className="text-3xl font-black mt-2 text-amber-400">{borrowedCount}</p>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4">📚 Institutional Inventory & Equipment</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Asset ID</th>
                <th className="py-3 px-4">Title / Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {assets.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono text-xs text-indigo-400">{item.assetId}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{item.title}</td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{item.school?.name}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      item.status === "Available" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {assets.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    No library or asset records found.
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
