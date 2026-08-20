'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  GitPullRequest, 
  Cpu, 
  CheckCircle2, 
  Play, 
  Server, 
  Layers, 
  ShieldCheck, 
  Clock, 
  Copy,
  Activity,
  Code2
} from 'lucide-react';

export default function SoftwareDeveloperPortal() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'sprint' | 'terminal'>('pipeline');
  const [terminalCmd, setTerminalCmd] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    '$ smartcampus-cli --status',
    '[INFO] Initializing multi-agent microservices...',
    '[SUCCESS] Connected to Kubernetes cluster (us-east-1)',
    '[READY] Developer workspace active for ThomasG.'
  ]);
  const [isRunningBuild, setIsRunningBuild] = useState(false);

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalCmd.trim()) return;
    const newLogs = [...terminalLogs, `$ ${terminalCmd}`, `[EXEC] Executing ${terminalCmd} across staging cluster...`, `[SUCCESS] Process completed with exit code 0.`];
    setTerminalLogs(newLogs);
    setTerminalCmd('');
  };

  const triggerPipeline = () => {
    setIsRunningBuild(true);
    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        '$ npm run build',
        'Creating an optimized production build...',
        'Compiled successfully and linted 48 files.',
        '[DEPLOY] Deployed to Vercel production preview.'
      ]);
      setIsRunningBuild(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded-full uppercase tracking-widest">
                Engineering Division
              </span>
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono rounded-full">
                Next.js & Microservices
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Terminal className="w-10 h-10 text-cyan-400" />
              Software Developer Hub
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm md:text-base">
              Manage CI/CD pipelines, review active sprint tickets, inspect container telemetry, and run live diagnostic commands.
            </p>
          </div>

          <button
            onClick={triggerPipeline}
            disabled={isRunningBuild}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            {isRunningBuild ? 'Running CI/CD Build...' : 'Trigger Staging Build'}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-mono">Cluster Health</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white">99.98% Uptime</div>
            <div className="text-xs text-emerald-400 mt-1">All 14 pods operational</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-mono">Open Pull Requests</span>
              <GitPullRequest className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white">6 Active PRs</div>
            <div className="text-xs text-slate-400 mt-1">2 pending code review</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-mono">API Latency</span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-bold text-white">42ms avg</div>
            <div className="text-xs text-emerald-400 mt-1">Optimized cache hit rate</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-mono">Security Scan</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white">0 Vulnerabilities</div>
            <div className="text-xs text-emerald-400 mt-1">Snyk & Dependabot clear</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'pipeline' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400'}`}
          >
            CI/CD Pipeline & Deployments
          </button>
          <button
            onClick={() => setActiveTab('sprint')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'sprint' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400'}`}
          >
            Sprint Backlog
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 ${activeTab === 'terminal' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400'}`}
          >
            <Code2 className="w-4 h-4" /> Live Terminal Console
          </button>
        </div>

        {/* Tab: Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Recent Git Actions & Builds</h3>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 overflow-hidden">
              {[
                { repo: 'smartcampus-core-api', branch: 'main', status: 'Success', time: '12 mins ago', hash: 'a8f93bc' },
                { repo: 'smartcampus-frontend', branch: 'feature/phd-portal', status: 'Success', time: '1 hour ago', hash: '3b2d1ef' },
                { repo: 'smartcampus-iot-gateway', branch: 'staging', status: 'Building', time: 'In progress', hash: '7c4a89d' },
                { repo: 'smartcampus-auth-service', branch: 'main', status: 'Success', time: '4 hours ago', hash: '9e1f2a4' }
              ].map((item, idx) => (
                <div key={idx} className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-base">{item.repo}</span>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-xs rounded">{item.branch}</span>
                    </div>
                    <div className="text-xs font-mono text-slate-400">Commit Hash: {item.hash} • {item.time}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Sprint */}
        {activeTab === 'sprint' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white">To Do (3)</h4>
                <span className="text-xs font-mono text-slate-400">Sprint 24</span>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-mono rounded">Backend</span>
                  <div className="text-sm font-semibold text-slate-200">Refactor Redis Cache Cluster</div>
                  <div className="text-xs text-slate-400">Estimate: 5 Story Points</div>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-mono rounded">Frontend</span>
                  <div className="text-sm font-semibold text-slate-200">Dark Mode Contrast Tuning</div>
                  <div className="text-xs text-slate-400">Estimate: 3 Story Points</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white">In Progress (2)</h4>
                <span className="text-xs font-mono text-cyan-400">Active</span>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-2">
                  <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono rounded">AI Module</span>
                  <div className="text-sm font-semibold text-slate-200">Integrate GPT-4o Grammar Polishing</div>
                  <div className="text-xs text-slate-400">Estimate: 8 Story Points</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white">Completed (4)</h4>
                <span className="text-xs font-mono text-emerald-400">Done</span>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 opacity-75">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded">DevOps</span>
                  <div className="text-sm font-semibold text-slate-200 line-through">Kubernetes Autoscaling Config</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Terminal */}
        {activeTab === 'terminal' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                Interactive Shell Console
              </h3>
              <span className="text-xs font-mono text-slate-400">bash / zsh</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-[300px] overflow-y-auto font-mono text-xs text-cyan-300 space-y-2">
              {terminalLogs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>

            <form onSubmit={handleRunCommand} className="flex gap-3">
              <input
                type="text"
                value={terminalCmd}
                onChange={(e) => setTerminalCmd(e.target.value)}
                placeholder="Type command (e.g., npm test, docker ps, git status)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
              >
                Execute
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
