export const dynamic = "force-dynamic";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 selection:bg-blue-600 selection:text-white">
      <div className="max-w-4xl text-center space-y-6">
        <div className="inline-block px-4 py-1.5 mb-2 rounded-full text-xs font-semibold tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Enterprise Campus ERP & SaaS OS
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          SmartCampus <span className="text-blue-500">AI</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          The all-in-one operating system for modern educational institutions. Manage admissions, finance, student records, and multi-tenant school operations seamlessly.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/local/login"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-lg transition shadow-lg shadow-blue-600/30 text-white"
          >
            Access Portal & Dashboard →
          </a>
        </div>
      </div>
    </main>
  );
}