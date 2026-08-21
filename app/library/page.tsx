import { prisma } from "@/lib/prisma";




export default async function LibraryPage() {
  const assets = await prisma.libraryAsset.findMany({
    include: { tenant: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest px-3 py-1 bg-amber-500/15 text-amber-400 rounded-full font-semibold border border-amber-500/25">
              Digital Library & Resources
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-2">Library Inventory & Asset Tracking</h1>
            <p className="text-slate-400 text-sm mt-1">Manage physical books, digital publications, and resource lending status.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-amber-400">
            Total Assets: {assets.length}
          </div>
        </div>

        {/* Library Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200">
            Cataloged Assets
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Tenant Workspace</th>
                <th className="px-6 py-3 font-semibold">Title</th>
                <th className="px-6 py-3 font-semibold">Author</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Added At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {assets.map((asset: any) => (
                <tr key={asset.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white">{asset.tenant?.name || "Global Tenant"}</td>
                  <td className="px-6 py-4 font-bold text-indigo-400">{asset.title}</td>
                  <td className="px-6 py-4 text-slate-300">{asset.author || "Unknown"}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{new Date(asset.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {assets.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No library assets cataloged yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
