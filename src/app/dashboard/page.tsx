'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Terminal, 
  Briefcase, 
  UserCheck, 
  GraduationCap, 
  CheckSquare, 
  Square, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight,
  Clock,
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';
import Link from 'next/link';

export default function MasterDashboard() {
  const [kanbanItems, setKanbanItems] = useState([
    { id: 1, title: 'PhD Chapter 4 Revision', category: 'Academic', status: 'in-progress', link: '/phd-lincoln' },
    { id: 2, title: 'Scopus Q1 Journal Proofing', category: 'Academic', status: 'completed', link: '/phd-lincoln' },
    { id: 3, title: 'Redis Cache Cluster Refactor', category: 'Engineering', status: 'todo', link: '/software-developer' },
    { id: 4, title: 'GPT-4o Grammar Polisher Integration', category: 'Engineering', status: 'in-progress', link: '/software-developer' },
    { id: 5, title: 'University of Malaya Proposal', category: 'Sales CRM', status: 'negotiation', link: '/sales-crm' },
    { id: 6, title: 'Taylor’s Education Group Contract', category: 'Sales CRM', status: 'won', link: '/sales-crm' },
    { id: 7, title: 'GitHub Enterprise SSO Setup', category: 'Onboarding', status: 'in-progress', link: '/onboarding' },
    { id: 8, title: 'Compliance & Security Training', category: 'Onboarding', status: 'todo', link: '/onboarding' }
  ]);

  const toggleItemStatus = (id: number) => {
    setKanbanItems(kanbanItems.map(item => {
      if (item.id === id) {
        const nextStatus = 
          item.status === 'todo' ? 'in-progress' :
          item.status === 'in-progress' ? 'completed' :
          item.status === 'completed' ? 'todo' : 'won';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Quick Navigation */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded-full uppercase tracking-widest">
                ThomasG Technologies • Master Control
              </span>
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono rounded-full">
                Unified Kanban View
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <LayoutDashboard className="w-10 h-10 text-cyan-400" />
              Operations & Projects Command Center
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm md:text-base">
              Monitor and manage academic milestones, engineering sprints, sales pipelines, and onboarding tasks simultaneously from one single screen.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/phd-lincoln" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors">
              <GraduationCap className="w-4 h-4 text-cyan-400" /> PhD Portal <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </Link>
            <Link href="/software-developer" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors">
              <Terminal className="w-4 h-4 text-indigo-400" /> Dev Hub <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </Link>
            <Link href="/sales-crm" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors">
              <Briefcase className="w-4 h-4 text-emerald-400" /> Sales CRM <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </Link>
            <Link href="/onboarding" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors">
              <UserCheck className="w-4 h-4 text-purple-400" /> Onboarding <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Global KPI Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">PhD Progress</div>
              <div className="text-xl font-bold text-white">78% Done</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">Cluster Uptime</div>
              <div className="text-xl font-bold text-white">99.98%</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">Pipeline Value</div>
              <div className="text-xl font-bold text-white">$70,500</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">Onboarding Setup</div>
              <div className="text-xl font-bold text-white">60% Complete</div>
            </div>
          </div>
        </div>

        {/* Kanban Board View Across All Portals */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Cross-Division Kanban Board</h3>
            <span className="text-xs text-slate-400 font-mono">Click card status tag to cycle progress</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Column 1: To Do */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white text-sm">To Do / Backlog</h4>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-[10px] rounded-full">
                  {kanbanItems.filter(i => i.status === 'todo').length}
                </span>
              </div>
              <div className="space-y-3">
                {kanbanItems.filter(i => i.status === 'todo').map(item => (
                  <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 shadow-md hover:border-slate-700 transition-all">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono rounded">
                        {item.category}
                      </span>
                      <button 
                        onClick={() => toggleItemStatus(item.id)}
                        className="text-[10px] font-mono text-cyan-400 hover:underline"
                      >
                        Advance →
                      </button>
                    </div>
                    <div className="font-semibold text-slate-200 text-sm">{item.title}</div>
                    <div className="pt-2 border-t border-slate-900 flex justify-between items-center">
                      <Link href={item.link} className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-mono">
                        View Portal <ArrowUpRight className="w-3 h-3" />
                      </Link>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded font-mono">Pending</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white text-sm">In Progress</h4>
                <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[10px] rounded-full">
                  {kanbanItems.filter(i => i.status === 'in-progress' || i.status === 'negotiation').length}
                </span>
              </div>
              <div className="space-y-3">
                {kanbanItems.filter(i => i.status === 'in-progress' || i.status === 'negotiation').map(item => (
                  <div key={item.id} className="p-4 bg-slate-950 border border-cyan-500/30 rounded-xl space-y-3 shadow-md">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-mono rounded border border-cyan-500/20">
                        {item.category}
                      </span>
                      <button 
                        onClick={() => toggleItemStatus(item.id)}
                        className="text-[10px] font-mono text-cyan-400 hover:underline"
                      >
                        Advance →
                      </button>
                    </div>
                    <div className="font-semibold text-slate-200 text-sm">{item.title}</div>
                    <div className="pt-2 border-t border-slate-900 flex justify-between items-center">
                      <Link href={item.link} className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-mono">
                        View Portal <ArrowUpRight className="w-3 h-3" />
                      </Link>
                      <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] rounded font-mono">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Completed */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white text-sm">Completed</h4>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] rounded-full">
                  {kanbanItems.filter(i => i.status === 'completed' || i.status === 'won').length}
                </span>
              </div>
              <div className="space-y-3">
                {kanbanItems.filter(i => i.status === 'completed' || i.status === 'won').map(item => (
                  <div key={item.id} className="p-4 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-3 shadow-md opacity-90">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded border border-emerald-500/20">
                        {item.category}
                      </span>
                      <button 
                        onClick={() => toggleItemStatus(item.id)}
                        className="text-[10px] font-mono text-slate-400 hover:underline"
                      >
                        Reset ↺
                      </button>
                    </div>
                    <div className="font-semibold text-slate-300 text-sm line-through">{item.title}</div>
                    <div className="pt-2 border-t border-slate-900 flex justify-between items-center">
                      <Link href={item.link} className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-mono">
                        View Portal <ArrowUpRight className="w-3 h-3" />
                      </Link>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded font-mono">Done</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 4: Quick Actions / Shortcuts */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white text-sm">Portal Shortcuts</h4>
                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-mono text-[10px] rounded-full">
                  Navigation
                </span>
              </div>
              <div className="space-y-3">
                <Link href="/phd-lincoln" className="block p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all space-y-1">
                  <div className="font-bold text-cyan-400 text-xs flex items-center justify-between">
                    PhD Lincoln Portal <ArrowUpRight className="w-3 h-3" />
                  </div>
                  <div className="text-[11px] text-slate-400">Chapters, AI Grammar & Journal Matcher</div>
                </Link>

                <Link href="/software-developer" className="block p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all space-y-1">
                  <div className="font-bold text-indigo-400 text-xs flex items-center justify-between">
                    Software Developer Hub <ArrowUpRight className="w-3 h-3" />
                  </div>
                  <div className="text-[11px] text-slate-400">CI/CD pipelines, sprint boards & terminal</div>
                </Link>

                <Link href="/sales-crm" className="block p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all space-y-1">
                  <div className="font-bold text-emerald-400 text-xs flex items-center justify-between">
                    Sales CRM Dashboard <ArrowUpRight className="w-3 h-3" />
                  </div>
                  <div className="text-[11px] text-slate-400">Institutional pipeline & lead directory</div>
                </Link>

                <Link href="/onboarding" className="block p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all space-y-1">
                  <div className="font-bold text-purple-400 text-xs flex items-center justify-between">
                    Onboarding Process Hub <ArrowUpRight className="w-3 h-3" />
                  </div>
                  <div className="text-[11px] text-slate-400">Checklists, HR papers & IT setup</div>
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
