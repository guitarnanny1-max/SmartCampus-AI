export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartWeatherPage() {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stationCode, setStationCode] = useState('');
  const [stationName, setStationName] = useState('');
  const [windSpeedKmh, setWindSpeedKmh] = useState('12.5');
  const [barometricPressureHpa, setBarometricPressureHpa] = useState('1013.25');
  const [uvIndex, setUvIndex] = useState('4.2');
  const [precipitationMm, setPrecipitationMm] = useState('0.0');
  const [weatherAlertStatus, setWeatherAlertStatus] = useState('NORMAL');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-weather')
      .then(res => res.json())
      .then(data => {
        setStations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stationCode, stationName, windSpeedKmh, barometricPressureHpa, uvIndex, precipitationMm, weatherAlertStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register station');

      setStations([data, ...stations]);
      setStationCode('');
      setStationName('');
      alert('Smart weather station registered successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/35">
                SMART WEATHER & MICROCLIMATE HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Meteorological Stations & Air Telemetry</h1>
            <p className="text-xs text-slate-400">Monitor wind vectors, barometric pressure, UV radiation index, precipitation, and severe weather warnings.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddStation} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⛅</span> Register Weather Station
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Station Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. WX-ENG-04" 
                value={stationCode} 
                onChange={e => setStationCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Station Name</label>
              <input 
                type="text" 
                placeholder="e.g. Engineering Quad Weather Tower" 
                value={stationName} 
                onChange={e => setStationName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Wind Speed (km/h)</label>
              <input 
                type="number" 
                step="0.1" 
                value={windSpeedKmh} 
                onChange={e => setWindSpeedKmh(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Pressure (hPa)</label>
              <input 
                type="number" 
                step="0.01" 
                value={barometricPressureHpa} 
                onChange={e => setBarometricPressureHpa(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">UV Index</label>
              <input 
                type="number" 
                step="0.1" 
                value={uvIndex} 
                onChange={e => setUvIndex(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Precipitation (mm)</label>
              <input 
                type="number" 
                step="0.1" 
                value={precipitationMm} 
                onChange={e => setPrecipitationMm(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Alert Status</label>
              <select 
                value={weatherAlertStatus} 
                onChange={e => setWeatherAlertStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
              >
                <option value="NORMAL">Normal</option>
                <option value="WIND_ADVISORY">Wind Advisory</option>
                <option value="STORM_WARNING">Storm Warning</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition-all disabled:opacity-50 shadow-lg shadow-sky-500/20"
            >
              {adding ? 'Registering Station...' : 'Add Weather Station →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌤️</span> Active Meteorological Stations ({stations.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Station Code & Name</th>
                  <th className="p-4 font-medium">Wind & Pressure</th>
                  <th className="p-4 font-medium">UV & Precipitation</th>
                  <th className="p-4 font-medium text-right">Alert Status</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((s: any) => (
                  <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{s.stationCode}</p>
                      <p className="text-[10px] text-slate-400">{s.stationName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sky-400 font-semibold">{s.windSpeedKmh} km/h Wind</p>
                      <p className="text-[10px] text-slate-400">{s.barometricPressureHpa} hPa Pressure</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-300">UV: {s.uvIndex}</p>
                      <p className="text-[10px] text-slate-400">{s.precipitationMm} mm Rain</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        s.weatherAlertStatus === 'NORMAL'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : s.weatherAlertStatus === 'WIND_ADVISORY'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                      }`}>
                        {s.weatherAlertStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {stations.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No weather stations registered.
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
