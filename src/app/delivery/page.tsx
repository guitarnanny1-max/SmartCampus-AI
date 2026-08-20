'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DeliveryPage() {
  const [fleet, setFleet] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleType, setVehicleType] = useState('ROBOT');
  const [currentBattery, setCurrentBattery] = useState('90');
  const [currentLocation, setCurrentLocation] = useState('');
  const [payloadDescription, setPayloadDescription] = useState('');
  const [dispatching, setDispatching] = useState(false);

  useEffect(() => {
    fetch('/api/delivery')
      .then(res => res.json())
      .then(data => {
        setFleet(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setDispatching(true);

    try {
      const res = await fetch('/api/delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleName, vehicleType, currentBattery, currentLocation, payloadDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch vehicle');

      setFleet([data, ...fleet]);
      setVehicleName('');
      setCurrentLocation('');
      setPayloadDescription('');
      alert('Autonomous delivery unit dispatched successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                AUTONOMOUS FLEET & LOGISTICS
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Delivery Drones & Robots Hub</h1>
            <p className="text-xs text-slate-400">Track campus delivery rovers, aerial drones, and automated transport buggies in real-time.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleDispatch} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🤖</span> Dispatch Autonomous Unit
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Vehicle / Bot Name</label>
              <input 
                type="text" 
                placeholder="e.g. Rover Gamma-07" 
                value={vehicleName} 
                onChange={e => setVehicleName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Vehicle Type</label>
              <select 
                value={vehicleType} 
                onChange={e => setVehicleType(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="ROBOT">Delivery Rover (Ground)</option>
                <option value="DRONE">Aerial Delivery Drone</option>
                <option value="BUGGY">Autonomous Transit Buggy</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Current Location / Route</label>
              <input 
                type="text" 
                placeholder="e.g. South Gate to Dorms" 
                value={currentLocation} 
                onChange={e => setCurrentLocation(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Payload Description</label>
              <input 
                type="text" 
                placeholder="e.g. Cafeteria Lunch Packages" 
                value={payloadDescription} 
                onChange={e => setPayloadDescription(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Battery Level (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={currentBattery} 
                onChange={e => setCurrentBattery(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={dispatching} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {dispatching ? 'Dispatching Unit...' : 'Dispatch Mission →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🛰️</span> Active Fleet Registry ({fleet.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Vehicle / Type</th>
                  <th className="p-4 font-medium">Payload</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Battery</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {fleet.map((item) => (
                  <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{item.vehicleName}</p>
                      <p className="text-[10px] text-cyan-400">{item.vehicleType}</p>
                    </td>
                    <td className="p-4 text-slate-300">{item.payloadDescription}</td>
                    <td className="p-4 text-slate-300">{item.currentLocation}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-cyan-400 h-full" style={{ width: `${item.currentBattery}%` }}></div>
                        </div>
                        <span className="text-slate-300 font-mono text-[10px]">{item.currentBattery}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {fleet.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No autonomous delivery vehicles registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
