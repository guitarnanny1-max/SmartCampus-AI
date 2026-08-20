'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartMedicalHospitalPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentCode, setDepartmentCode] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [hospitalBedsCount, setHospitalBedsCount] = useState('150');
  const [dailyOpdFootfall, setDailyOpdFootfall] = useState('450');
  const [residentDoctorsCount, setResidentDoctorsCount] = useState('45');
  const [aiDiagnosticMode, setAiDiagnosticMode] = useState('AI_RADIOLOGY_DIAGNOSTIC_ASSISTANT');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-medical-hospital')
      .then(res => res.json())
      .then(data => {
        setDepartments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-medical-hospital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departmentCode, departmentName, hospitalBedsCount, dailyOpdFootfall, residentDoctorsCount, aiDiagnosticMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register department');

      setDepartments([data, ...departments]);
      setDepartmentCode('');
      setDepartmentName('');
      alert('Medical department registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/35">
                MEDICAL COLLEGE & TEACHING HOSPITAL MANAGEMENT HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Clinical & Hospital Grid</h1>
            <p className="text-xs text-slate-400">Monitor multi-specialty wards, hospital bed capacity, OPD footfalls, and AI diagnostic tools.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddDepartment} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🩺</span> Register Clinical Department / Ward
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Department Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. NEURO-04" 
                value={departmentCode} 
                onChange={e => setDepartmentCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Department Name</label>
              <input 
                type="text" 
                placeholder="e.g. Neurology & Neurosurgery Ward" 
                value={departmentName} 
                onChange={e => setDepartmentName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Hospital Beds</label>
              <input 
                type="number" 
                value={hospitalBedsCount} 
                onChange={e => setHospitalBedsCount(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Daily OPD Footfall</label>
              <input 
                type="number" 
                value={dailyOpdFootfall} 
                onChange={e => setDailyOpdFootfall(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Resident Doctors</label>
              <input 
                type="number" 
                value={residentDoctorsCount} 
                onChange={e => setResidentDoctorsCount(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Diagnostic Mode</label>
              <select 
                value={aiDiagnosticMode} 
                onChange={e => setAiDiagnosticMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="AI_RADIOLOGY_DIAGNOSTIC_ASSISTANT">AI Radiology Assistant</option>
                <option value="AUTOMATED_TRIAGE_OPTIMIZER">Automated Triage Optimizer</option>
                <option value="PREDICTIVE_BED_OCCUPANCY_FORECASTER">Predictive Bed Occupancy</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-rose-500 text-slate-950 font-bold text-xs hover:bg-rose-400 transition-all disabled:opacity-50 shadow-lg shadow-rose-500/20"
            >
              {adding ? 'Registering Department...' : 'Add Medical Department →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏥</span> Active Clinical Departments ({departments.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Department Code & Name</th>
                  <th className="p-4 font-medium">Beds & OPD Footfall</th>
                  <th className="p-4 font-medium">Resident Staffing</th>
                  <th className="p-4 font-medium text-right">AI Diagnostic Mode</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{d.departmentCode}</p>
                      <p className="text-[10px] text-slate-400">{d.departmentName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-rose-400 font-semibold">{d.hospitalBedsCount} Beds</p>
                      <p className="text-[10px] text-slate-400">{d.dailyOpdFootfall} Daily OPD</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {d.residentDoctorsCount} Residents
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        d.aiDiagnosticMode === 'AI_RADIOLOGY_DIAGNOSTIC_ASSISTANT'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                          : d.aiDiagnosticMode === 'AUTOMATED_TRIAGE_OPTIMIZER'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {d.aiDiagnosticMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {departments.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No clinical departments registered.
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
