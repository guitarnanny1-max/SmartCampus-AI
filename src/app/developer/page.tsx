export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DeveloperPortalPage() {
  const [apiKey, setApiKey] = useState('sc_live_dps_98f7a6bc543210');
  const [endpoint, setEndpoint] = useState('/api/v1/telemetry');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestRequest = async () => {
    setLoading(true);
    setResponse(null);

    setTimeout(() => {
      if (endpoint === '/api/v1/telemetry') {
        setResponse(JSON.stringify({
          status: 'success',
          timestamp: new Date().toISOString(),
          tenant: 'Delhi Public School',
          zones: [
            { zoneName: 'Academic Block A', solarOutput: '45 kW', hvacStatus: 'Optimal', temperature: '22°C' },
            { zoneName: 'Sports Complex', solarOutput: '30 kW', hvacStatus: 'Standby', temperature: '24°C' }
          ]
        }, null, 2));
      } else {
        setResponse(JSON.stringify({
          status: 'success',
          timestamp: new Date().toISOString(),
          message: 'Webhook test event dispatched successfully to target endpoint.',
          eventId: 'evt_9988776654321'
        }, null, 2));
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                API DEVELOPER HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">SmartCampus AI API Sandbox</h1>
            <p className="text-xs text-slate-400">Test REST API endpoints and inspect secure bearer token authentication payloads.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Request Configuration</h3>
              <p className="text-xs text-slate-400">Provide your tenant API key and select an endpoint to query.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Bearer API Key</label>
                <input 
                  type="text" 
                  value={apiKey} 
                  onChange={e => setApiKey(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-cyan-400 focus:border-cyan-500 focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">API Endpoint</label>
                <select 
                  value={endpoint} 
                  onChange={e => setEndpoint(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="/api/v1/telemetry">GET /api/v1/telemetry (Energy & HVAC Sensors)</option>
                  <option value="/api/v1/webhooks/test">POST /api/v1/webhooks/test (Trigger Event Dispatch)</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleTestRequest} 
                  disabled={loading} 
                  className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
                >
                  {loading ? 'Sending Request...' : 'Send Test Request →'}
                </button>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-2">
              <h4 className="text-xs font-semibold text-white">Authentication Header Spec</h4>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto">
{`Authorization: Bearer sc_live_dps_...
Content-Type: application/json`}
              </pre>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Response Inspector</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                HTTP 200 OK
              </span>
            </div>
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto min-h-[300px] flex items-center">
              {loading ? (
                <div className="text-slate-500 animate-pulse w-full text-center">Executing secure request...</div>
              ) : response ? (
                <pre className="w-full">{response}</pre>
              ) : (
                <div className="text-slate-600 w-full text-center">Click &quot;Send Test Request&quot; to inspect payloads.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
