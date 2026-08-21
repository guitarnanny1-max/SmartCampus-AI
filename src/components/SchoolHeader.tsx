import { getCurrentSchool } from '@/lib/current-school';
import Link from 'next/link';
import { headers } from 'next/headers';

export default async function SchoolHeader() {
  const school = await getCurrentSchool();
  const headerList = await headers();
  const currentRole = headerList.get('x-user-role') || 'TENANT_ADMIN';

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {(school as any).logoUrl ? (
          <img src={(school as any).logoUrl} alt={school.name} className="w-10 h-10 rounded-xl object-cover border border-cyan-500/30 shadow-md" />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400">
            {school.name.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-base font-bold text-white">{school.name}</h1>
          <span className="text-[11px] text-cyan-400 font-medium tracking-wide uppercase">
            Tenant: {school.subdomain}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        {/* RBAC Role Indicator */}
        <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
          <span className="text-slate-500">Role:</span>
          <span className="font-mono text-cyan-400 font-bold">{currentRole}</span>
        </div>

        {/* Settings Link */}
        <Link href="/settings" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500 transition-all font-medium">
          🛠️ Settings
        </Link>

        {/* Admin Portal Link */}
        <Link href="/admin/schools" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500 transition-all font-medium">
          ⚙️ Super Admin
        </Link>

        {/* Tenant Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 hidden sm:inline">Tenant:</span>
          <Link href="/?school=dps" className={`px-3 py-1.5 rounded-lg border transition-all ${school.subdomain === 'dps' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}>
            DPS
          </Link>
          <Link href="/?school=greenwood" className={`px-3 py-1.5 rounded-lg border transition-all ${school.subdomain === 'greenwood' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}>
            Greenwood
          </Link>
        </div>
      </div>
    </header>
  );
}
