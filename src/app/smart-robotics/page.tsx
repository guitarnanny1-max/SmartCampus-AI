'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartRoboticsPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [labCode, setLabCode] = useState('');
  const [labName, setLabName] = useState('');
  const [activeRobotsCount, setActiveRobotsCount] = useState('35');
  const [payloadCapacityKg, setPayloadCapacityKg] = useState('15.5');
  const [neuralGraspSuccessRatePct, setNeuralGraspSuccessRatePct] = useState('99.4');
  const [aiNavigationMode, setAiNavigationMode] = useState('SIMULTANEOUS_LOCALIZATION_AND_MAPPING_VIO');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-robotics')
      .then(res => res.json())
      .then(data => {
        setLabs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddLab = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-robotics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labCode, labName, activeRobotsCount, payloadCapacityKg, neuralGraspSuccessRatePct, aiNavigationMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register lab');

      setLabs([data, ...labs]);
      setLabCode('');
      setLabName('');
      alert('Robotics lab registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/35">
                SMART AUTONOMOUS ROBOTICS & ROBOTIC ARM HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Autonomous Robotics Grid</h1>
            <p className="text-xs text-slate-400">Monitor active robot fleets, payload capacities, neural grasp success rates, and AI navigation modes.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddLab} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🤖</span> Register Robotics Lab / Fleet
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Lab Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. ROBO-LAB-04" 
                value={labCode} 
                onChange={e => setLabCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Lab Name</label>
              <input 
                type="text" 
                placeholder="e.g. Advanced Mechatronics & Swarm Lab" 
                value={labName} 
                onChange={e => setLabName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Active Robots</label>
              <input 
                type="number" 
                value={activeRobotsCount} 
                onChange={e => setActiveRobotsCount(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Payload Capacity (kg)</label>
              <input 
                type="number" 
                step="0.5" 
                value={payloadCapacityKg} 
                onChange={e => setPayloadCapacityKg(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Grasp Success (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={neuralGraspSuccessRatePct} 
                onChange={e => setNeuralGraspSuccessRatePct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Navigation Mode</label>
              <select 
                value={aiNavigationMode} 
                onChange={e => setAiNavigationMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
              >
                <option value="SIMULTANEOUS_LOCALIZATION_AND_MAPPING_VIO">SLAM VIO Navigation</option>
                <option value="COMPUTER_VISION_TACTILE_FEEDBACK_GRASP">Tactile Feedback Grasp</option>
                <option value="DEEP_REINFORCEMENT_LEARNING_PATHFINDER">RL Pathfinding Swarm</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-all disabled:opacity-50 shadow-lg shadow-teal-500/20"
            >
              {adding ? 'Registering Lab...' : 'Add Robotics Lab →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🤖</span> Active Robotics Labs ({labs.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Lab Code & Name</th>
                  <th className="p-4 font-medium">Robots & Payload</th>
                  <th className="p-4 font-medium">Neural Grasp Rate</th>
                  <th className="p-4 font-medium text-right">AI Navigation Mode</th>
                </tr>
              </thead>
              <tbody>
                {labs.map((l) => (
                  <tr key={l.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{l.labCode}</p>
                      <p className="text-[10px] text-slate-400">{l.labName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-teal-400 font-semibold">{l.activeRobotsCount} Active Robots</p>
                      <p className="text-[10px] text-slate-400">{l.payloadCapacityKg} kg Payload</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {l.neuralGraspSuccessRatePct}% Grasp Success
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        l.aiNavigationMode === 'SIMULTANEOUS_LOCALIZATION_AND_MAPPING_VIO'
                          ? 'bg-teal-500/10 text-teal-400 border-teal-500/35'
                          : l.aiNavigationMode === 'COMPUTER_VISION_TACTILE_FEEDBACK_GRASP'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {l.aiNavigationMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {labs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No robotics labs registered.
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
