'use client';

import { useState, useEffect } from 'react';

export default function LiveTelemetryStream() {
  const [telemetry, setTelemetry] = useState<{
    timestamp: string;
    solarOutput: string;
    gridLoad: string;
    temperature: string;
  } | null>(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/telemetry/stream');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTelemetry(data);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            LIVE IoT STREAM (SSE)
          </span>
        </div>
        <h3 className="text-base font-bold text-white">Real-Time Sensor Telemetry Ticker</h3>
        <p className="text-xs text-slate-400">Direct streaming connection to campus edge IoT gateways</p>
      </div>

      <div className="flex flex-wrap gap-4 bg-slate-900/60 border border-slate-800 px-5 py-3 rounded-xl text-xs font-mono">
        <div>
          <span className="text-slate-500 block text-[10px]">Solar Generation</span>
          <span className="text-cyan-400 font-bold">{telemetry ? telemetry.solarOutput : 'Connecting...'}</span>
        </div>
        <div className="border-r border-slate-800"></div>
        <div>
          <span className="text-slate-500 block text-[10px]">Grid Power Load</span>
          <span className="text-amber-400 font-bold">{telemetry ? telemetry.gridLoad : 'Connecting...'}</span>
        </div>
        <div className="border-r border-slate-800"></div>
        <div>
          <span className="text-slate-500 block text-[10px]">Ambient HVAC Temp</span>
          <span className="text-emerald-400 font-bold">{telemetry ? telemetry.temperature : 'Connecting...'}</span>
        </div>
      </div>
    </div>
  );
}
