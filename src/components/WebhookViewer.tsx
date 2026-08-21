export default function WebhookViewer({ logs }: { logs: { id: string; event: string; targetUrl: string; statusCode: number; payload: string; createdAt: Date }[] }) {
  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>⚡</span> Real-Time Webhook & Event Dispatch Log
        </h3>
        <p className="text-xs text-slate-400">Monitor automated event deliveries to external institutional endpoints</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
              <th className="p-3.5 font-medium">Timestamp</th>
              <th className="p-3.5 font-medium">Event Type</th>
              <th className="p-3.5 font-medium">Target Endpoint</th>
              <th className="p-3.5 font-medium">Status</th>
              <th className="p-3.5 font-medium">Payload Snapshot</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any) => (
              <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-colors">
                <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px]">
                    {log.event}
                  </span>
                </td>
                <td className="p-3.5 text-slate-300 font-mono text-[11px]">{log.targetUrl}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-bold text-[10px]">
                    {log.statusCode} OK
                  </span>
                </td>
                <td className="p-3.5 font-mono text-slate-400 text-[10px] truncate max-w-xs">{log.payload}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-500">
                  No webhook dispatches recorded for this tenant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
