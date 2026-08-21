import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
export const revalidate = 0;


import LeadKanbanBoard from '@/components/LeadKanbanBoard';



export default async function KanbanPage() {
  let leads: any[] = [];
  try {
    leads = await (prisma as any).lead.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (err) {
    console.error('Failed to load CRM Kanban leads:', err);
  }

  // Serialize dates for client component
  const serializedLeads = leads.map((l: any) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <div className='p-6 max-w-7xl mx-auto space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Sales CRM Pipeline Kanban</h1>
          <p className='text-sm text-gray-500'>Manage and advance inbound school leads across sales stages</p>
        </div>
        <div className='flex items-center space-x-3'>
          <a href='/dashboard/leads' className='px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-700 shadow-sm transition-colors'>
            Switch to Table View
          </a>
        </div>
      </div>
      <LeadKanbanBoard initialLeads={serializedLeads} />
    </div>
  );
}
