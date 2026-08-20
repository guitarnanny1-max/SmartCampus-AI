'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartBiometricAttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentOrFacultyName, setStudentOrFacultyName] = useState('');
  const [roleType, setRoleType] = useState('STUDENT');
  const [biometricDeviceCode, setBiometricDeviceCode] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('PRESENT');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-biometric-attendance')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-biometric-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentOrFacultyName, roleType, biometricDeviceCode, attendanceStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record attendance');

      setRecords([data, ...records]);
      setStudentOrFacultyName('');
      setBiometricDeviceCode('');
      alert('Biometric attendance logged successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/35">
                SMARTCAMPUS AI BIOMETRIC ATTENDANCE & TIMETABLE HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Biometric Face & RFID Gate Telemetry</h1>
            <p className="text-xs text-slate-400">Monitor real-time student and faculty attendance logs across campus entry points and lecture halls.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleAddRecord} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>👤</span> Log Biometric Attendance Entry
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Student or Faculty Name</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Anjali Deshmukh" 
                value={studentOrFacultyName} 
                onChange={e => setStudentOrFacultyName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Role Type</label>
              <select 
                value={roleType} 
                onChange={e => setRoleType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty / Professor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Biometric Device Code</label>
              <input 
                type="text" 
                placeholder="e.g. BIO-GATE-SOUTH-03" 
                value={biometricDeviceCode} 
                onChange={e => setBiometricDeviceCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Attendance Status</label>
              <select 
                value={attendanceStatus} 
                onChange={e => setAttendanceStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="PRESENT">Present (On Time)</option>
                <option value="LATE">Late Entry</option>
                <option value="ABSENT">Absent</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
            >
              {adding ? 'Logging Attendance...' : 'Log Attendance →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📋</span> Biometric Attendance Logs ({records.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Name & Role</th>
                  <th className="p-4 font-medium">Biometric Gate / Device</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{r.studentOrFacultyName}</p>
                      <p className="text-[10px] text-slate-400">{r.roleType}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-indigo-400 font-semibold">{r.biometricDeviceCode}</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        r.attendanceStatus === 'PRESENT'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : r.attendanceStatus === 'LATE'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                      }`}>
                        {r.attendanceStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No biometric attendance records found.
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
