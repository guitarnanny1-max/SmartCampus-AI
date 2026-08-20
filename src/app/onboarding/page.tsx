'use client';

import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  UserCheck, 
  FileText, 
  ShieldCheck, 
  Laptop, 
  Sparkles, 
  Award,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function OnboardingPortal() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Sign Employment / Consultancy Agreement', category: 'HR & Legal', status: 'completed' },
    { id: 2, title: 'Submit Tax & Banking Direct Deposit Details', category: 'Finance', status: 'completed' },
    { id: 3, title: 'Configure Corporate SSO & GitHub Enterprise Access', category: 'IT Provisioning', status: 'in-progress' },
    { id: 4, title: 'Complete Information Security & Compliance Training', category: 'Security', status: 'pending' },
    { id: 5, title: 'Schedule 1-on-1 Alignment with Engineering Lead', category: 'Culture', status: 'pending' }
  ]);

  const toggleOnboardingTask = (id: number) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'completed' ? 'pending' : 'completed'
        };
      }
      return t;
    }));
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercentage = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono rounded-full uppercase tracking-widest">
                People Operations
              </span>
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono rounded-full">
                New Hire & Partner Onboarding
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <UserCheck className="w-10 h-10 text-purple-400" />
              Onboarding Process Hub
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm md:text-base">
              Welcome aboard! Complete your setup tasks, sign required documentation, and configure your enterprise developer environment.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold font-mono">
              {progressPercentage}%
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">Onboarding Progress</div>
              <div className="text-sm font-bold text-white">{completedCount} of {tasks.length} tasks done</div>
            </div>
          </div>
        </div>

        {/* Quick Steps Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">HR Papers</div>
              <div className="text-sm font-bold text-emerald-400">Verified</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">IT Setup</div>
              <div className="text-sm font-bold text-cyan-400">In Progress</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">Security</div>
              <div className="text-sm font-bold text-amber-400">Action Required</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">Orientation</div>
              <div className="text-sm font-bold text-slate-200">Scheduled</div>
            </div>
          </div>
        </div>

        {/* Checklist Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Your Onboarding Checklist</h3>
            <span className="text-xs text-slate-400 font-mono">Click any item to toggle completion status</span>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 overflow-hidden">
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() => toggleOnboardingTask(task.id)}
                className="p-5 flex items-center justify-between hover:bg-slate-850 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  {task.status === 'completed' ? (
                    <CheckSquare className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-6 h-6 text-slate-500 flex-shrink-0" />
                  )}
                  <div className="space-y-0.5">
                    <span className={`text-base font-medium ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                      {task.title}
                    </span>
                    <div className="text-xs font-mono text-slate-400">{task.category}</div>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}>
                  {task.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
