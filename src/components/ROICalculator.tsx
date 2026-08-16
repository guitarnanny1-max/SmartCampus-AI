"use client";

import { useState } from "react";
import { Calculator, DollarSign, Clock, Users, ArrowRight, Sparkles } from "lucide-react";

export default function ROICalculator() {
  const [students, setStudents] = useState(1000);
  const [teachers, setTeachers] = useState(60);

  // Calculations
  const annualHoursSaved = teachers * 4 * 48; // 48 working weeks
  const annualDollarSavings = (annualHoursSaved * 25) + (students * 12);
  const hoursRecoveredPerStaff = (annualHoursSaved / teachers).toFixed(0);

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl border border-white/10 bg-[#16102f] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#e8d0a9]/5 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Column: Sliders & Inputs */}
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#e8d0a9] bg-[#e8d0a9]/10 px-3.5 py-1.5 rounded-full border border-[#e8d0a9]/20 inline-flex items-center gap-1.5">
                <Calculator className="h-3.5 w-3.5" /> Interactive ROI Estimator
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Calculate Your Institution&apos;s Annual Savings
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Adjust your student and educator count below to instantly estimate financial savings and administrative hours recovered with SmartCampus.
              </p>
            </div>

            <div className="space-y-6">
              {/* Student Slider */}
              <div className="space-y-3 bg-[#1f173d]/60 border border-white/10 p-6 rounded-2xl">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#e8d0a9]" /> Student Enrollment
                  </span>
                  <span className="font-mono font-bold text-[#e8d0a9] text-sm">{students.toLocaleString()} Students</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="100"
                  value={students}
                  onChange={(e) => setStudents(Number(e.target.value))}
                  className="w-full accent-[#e8d0a9] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>200</span>
                  <span>2,500</span>
                  <span>5,000+</span>
                </div>
              </div>

              {/* Teacher Slider */}
              <div className="space-y-3 bg-[#1f173d]/60 border border-white/10 p-6 rounded-2xl">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-400" /> Faculty & Staff Members
                  </span>
                  <span className="font-mono font-bold text-purple-400 text-sm">{teachers} Staff</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="300"
                  step="5"
                  value={teachers}
                  onChange={(e) => setTeachers(Number(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>15</span>
                  <span>150</span>
                  <span>300+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Results Box */}
          <div className="rounded-3xl border border-[#e8d0a9]/30 bg-[#1f173d] p-8 sm:p-10 space-y-8 shadow-2xl relative">
            <div className="absolute top-6 right-6">
              <Sparkles className="h-5 w-5 text-[#e8d0a9]" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Estimated Annual Impact</span>
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#e8d0a9] via-white to-[#e8d0a9] font-mono">
                ${annualDollarSavings.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">Combined operational savings & fee collection efficiency</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
                  {annualHoursSaved.toLocaleString()} hrs
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#e8d0a9]" /> Total Hours Saved / Yr
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400 font-mono">
                  {hoursRecoveredPerStaff} hrs
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-purple-400" /> Saved Per Staff / Yr
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#demo-request"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#e8d0a9] py-3.5 text-xs font-black text-black hover:bg-white transition-colors shadow-lg"
              >
                Claim These Savings — Request Demo <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
