export default function SettingsPage() {
  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-slate-800 text-slate-300 rounded-full font-semibold border border-slate-700">
            Platform Configuration
          </span>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">System Settings & Integrations</h1>
          <p className="text-slate-400 text-sm mt-1">Manage global institution parameters, security policies, API webhooks, and notification gateways.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tenant Configuration */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-4">🏫 Tenant Customization</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Institution Name</label>
              <input 
                type="text" 
                defaultValue="Global Tech Academy" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Subdomain Route</label>
              <input 
                type="text" 
                defaultValue="globaltech.smartcampus.ai" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-xs"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow">
              Save Changes
            </button>
          </div>
        </div>

        {/* API & Webhooks */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-4">🔌 API Webhooks & Automations</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Webhook Endpoint URL</label>
              <input 
                type="text" 
                defaultValue="https://api.globaltech.edu/v1/webhooks/campus" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Secret Key</label>
              <input 
                type="password" 
                defaultValue="sk_live_998127391823791283" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-xs"
              />
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow">
              Test Webhook Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
