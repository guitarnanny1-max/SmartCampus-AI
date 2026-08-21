export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';
import TenantSettingsForm from '@/components/TenantSettingsForm';
import ApiKeyManager from '@/components/ApiKeyManager';
import Link from 'next/link';

export default async function SettingsPage() {
  const school = await getCurrentSchool();
  const apiKeys = await (prisma as any).apiKey.findMany({
    where: { schoolId: school.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Tenant Administration</h2>
          <p className="text-sm text-slate-400">Configure global preferences and integrations for {school.name}</p>
        </div>
        <Link 
          href="/?school=dps" 
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium hover:border-cyan-500 transition-all"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <TenantSettingsForm initialName={school.name} initialLogo={(school as any).logoUrl} />
      <ApiKeyManager initialKeys={apiKeys} />
    </div>
  );
}
