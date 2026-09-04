import Link from "next/link";

export default function OperationsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div>
            <p className="text-sm font-semibold tracking-tight">
              ThomasG Technologies
            </p>
            <p className="text-xs text-slate-500">
              SmartCampusAI Platform Operations
            </p>
          </div>

          <Link
            href="/app"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            School Workspace
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            ThomasG Technologies
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Platform Operations
          </h1>

          <p className="mt-4 max-w-2xl text-slate-600">
            Manage SmartCampusAI school onboarding, CRM conversions, payment
            verification, tenants, subscriptions, and platform operations.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/product/crm"
            className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-sm font-semibold">CRM</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage school leads, enquiries, demos, follow-ups, and
              conversions.
            </p>
          </Link>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold">School Onboarding</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Convert qualified CRM leads into SmartCampusAI school tenants.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold">Payment Verification</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Verify school payments before activating their subscription and
              workspace.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold">Tenant Management</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage school tenants, plans, administrators, and platform
              access.
            </p>
          </div>
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                SmartCampusAI Operations
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This is the private operational layer of SmartCampusAI,
                operated by ThomasG Technologies.
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              Protected Operations
            </span>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Lead → School
              </p>
              <p className="mt-2 text-sm font-medium">
                CRM conversion workflow
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                School → Payment
              </p>
              <p className="mt-2 text-sm font-medium">
                Subscription verification
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Payment → Workspace
              </p>
              <p className="mt-2 text-sm font-medium">
                Tenant activation
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
