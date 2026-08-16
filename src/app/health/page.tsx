'use client';

import React, { useState } from 'react';
import { Sparkles, HeartPulse, Stethoscope, Activity, Shield, ArrowLeft, CheckCircle2, Search, Ambulance, Pill } from 'lucide-react';
import Link from 'next/link';

export default function HealthModule() {
  const [ambulanceSuccess, setAmbulanceSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const clinicVisits = [
    { patient: 'Aarav Sharma', id: 'STD-2024-042', condition: 'Acute Viral Fever & Fatigue', doctor: 'Dr. Meena Swaminathan', time: '10:15 AM', status: 'Treated & Discharged' },
    { patient: 'Rohan Gupta', id: 'STD-2025-019', condition: 'Sports Sprained Ankle (Basketball)', doctor: 'Dr. Ramesh Kumar', time: '11:00 AM', status: 'Under Observation' },
    { patient: 'Diya Patel', id: 'STD-2024-118', condition: 'Allergic Reaction / Prescribed Antihistamine', doctor: 'Dr. Meena Swaminathan', time: '01:30 PM', status: 'Prescription Issued' },
    { patient: 'Vikram Malhotra', id: 'STD-2023-902', condition: 'Routine Annual Health Checkup', doctor: 'Dr. Ananya Roy', time: '02:15 PM', status: 'Completed' },
  ];

  const handleDispatchAmbulance = () => {
    setAmbulanceSuccess(true);
    setTimeout(() => setAmbulanceSuccess(false), 3500);
  };

  const filteredVisits = clinicVisits.filter(item => 
    item.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus AI</h1>
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Health & Wellness Center</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Health & Wellness Center</h2>
            <p className="text-xs text-slate-400 mt-1">Manage campus clinic appointments, electronic health records (EHR), emergency ambulance dispatch, and pharmacy stock.</p>
          </div>
          <button
            onClick={handleDispatchAmbulance}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-red-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Ambulance className="w-4 h-4" />
            <span>Dispatch Emergency Ambulance</span>
          </button>
        </div>

        {ambulanceSuccess && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl text-xs text-red-300 flex items-center gap-2 animate-pulse">
            <Ambulance className="w-4 h-4 text-red-400 shrink-0" />
            <span>EMERGENCY AMBULANCE DISPATCHED: Campus medical team and nearest transport unit notified with live GPS coordinates.</span>
          </div>
        )}

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Daily Clinic Footfall</div>
            <div className="text-3xl font-extrabold text-white">48 Patients</div>
            <div className="text-[10px] text-slate-400">Average wait time &lt; 8 minutes</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Ambulance Response Time</div>
            <div className="text-3xl font-extrabold text-emerald-400">2.1 mins</div>
            <div className="text-[10px] text-emerald-400 font-medium">24/7 on-campus readiness</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Pharmacy Inventory Status</div>
            <div className="text-3xl font-extrabold text-cyan-400">99.4% Stock</div>
            <div className="text-[10px] text-slate-400">Automated essential medicine refill</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Mental Health Counseling</div>
            <div className="text-3xl font-extrabold text-white">310 Sessions</div>
            <div className="text-[10px] text-slate-400">Confidential peer & expert support</div>
          </div>
        </div>

        {/* Health Ledger */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-cyan-400" />
              <span>Campus Clinic & Patient Consultation Ledger</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search patient, ID, condition, doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredVisits.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.patient} • <span className="text-cyan-400">{item.id}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Condition: <strong className="text-slate-300">{item.condition}</strong></span>
                    <span>Attending Doctor: <strong className="text-slate-300">{item.doctor}</strong></span>
                    <span>Time Logged: <strong className="text-slate-300 font-mono">{item.time}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    item.status === 'Completed' || item.status === 'Treated & Discharged' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.status}
                  </span>
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-400 font-medium transition-colors cursor-pointer">
                    View EHR Dossier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Health & Wellness Center</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
