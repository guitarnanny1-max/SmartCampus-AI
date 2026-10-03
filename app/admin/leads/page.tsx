export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/app/lib/platform-auth";
import LeadWorkspace, { type CrmLead } from "./LeadWorkspace";

export default async function AdminLeadsPage() {
  const user = await requirePlatformAdmin();

  if (!user) {
    redirect("/login");
  }

  const leads = await prisma.platform_crm_leads.findMany({
    take: 100,
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      campus_name: true,
      contact_name: true,
      contact_role: true,
      email: true,
      mobile: true,
      city: true,
      state: true,
      website: true,
      emailSource: true,
      phoneSource: true,
      whatsappSource: true,
      whatsappNumber: true,
      emailAllowed: true,
      whatsappAllowed: true,
      voiceAllowed: true,
      optedOut: true,
    },
  });

  const serializableLeads: CrmLead[] = leads.map((lead) => ({
    ...lead,
  }));

  return <LeadWorkspace initialLeads={serializableLeads} />;
}
