export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">
          🛠️
        </div>

        <h1 className="text-2xl font-semibold text-slate-900">
          We&apos;ll be back shortly
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          SmartCampusAI is temporarily unavailable while we perform scheduled
          maintenance. Please try again shortly.
        </p>
      </div>
    </main>
  );
}
