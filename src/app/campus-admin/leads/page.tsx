export const revalidate = 0;
export const dynamic = "force-dynamic";

import { supabaseServer } from "@/lib/supabase/server";

export default async function AdminLeadsPage() {
  const supabase = await supabaseServer();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#030208] text-white p-8">
      <h1 className="text-3xl font-black mb-6">Institutional Leads</h1>
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden p-6">
        <p className="text-slate-400">Total Leads Found: {leads?.length || 0}</p>
      </div>
    </div>
  );
}
