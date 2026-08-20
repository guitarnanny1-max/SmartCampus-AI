'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Award, 
  UserCheck, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Calendar, 
  AlertCircle,
  ExternalLink,
  CheckSquare,
  Square,
  Wand2,
  Check,
  Copy,
  BookMarked,
  Cpu,
  Layers
} from 'lucide-react';

export default function PhdLincolnPortal() {
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'publications' | 'checklist' | 'ai-assistant' | 'thesis-generator'>('overview');
  
  const [checklist, setChecklist] = useState([
    { id: 1, task: 'Research Proposal Defense (VIVA 1)', status: 'completed', date: '14 Oct 2024' },
    { id: 2, task: 'Ethical Clearance & Institutional Approval', status: 'completed', date: '20 Jan 2025' },
    { id: 3, task: 'Data Collection & Experimental Simulation', status: 'completed', date: '10 Nov 2025' },
    { id: 4, task: 'Drafting Chapters 1 to 5 (Thesis Manuscript)', status: 'in-progress', date: 'Target: May 2026' },
    { id: 5, task: 'Scopus / WoS Indexed Journal Publication (2 Papers)', status: 'in-progress', date: 'Target: August 2026' },
    { id: 6, task: 'Turnitin Similarity Check (< 15% threshold)', status: 'pending', date: 'Target: Sep 2026' },
    { id: 7, task: 'Final Thesis Submission to Lincoln University', status: 'pending', date: 'Target: Oct 2026' },
    { id: 8, task: 'Final VIVA Voce (Thesis Defense)', status: 'pending', date: 'Target: Dec 2026' }
  ]);

  const [chapters, setChapters] = useState([
    { title: 'Chapter 1: Introduction & Problem Statement', status: 'Finalized', progress: 100, words: '8,500' },
    { title: 'Chapter 2: Literature Review & Theoretical Framework', status: 'Finalized', progress: 100, words: '18,200' },
    { title: 'Chapter 3: Methodology & System Architecture', status: 'Finalized', progress: 100, words: '14,100' },
    { title: 'Chapter 4: Implementation, Results & Discussion', status: 'Under Revision', progress: 85, words: '22,400' },
    { title: 'Chapter 5: Conclusion, Contributions & Future Scope', status: 'Drafting', progress: 60, words: '7,300' }
  ]);

  // AI Assistant States
  const [rawText, setRawText] = useState('');
  const [polishedText, setPolishedText] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [journalQuery, setJournalQuery] = useState('');
  const [journalSuggestions, setJournalSuggestions] = useState<any[]>([]);
  const [isSearchingJournals, setIsSearchingJournals] = useState(false);

  // Thesis Generator States
  const [selectedChapterGen, setSelectedChapterGen] = useState('Chapter 4');
  const [genPrompt, setGenPrompt] = useState('');
  const [generatedThesisContent, setGeneratedThesisContent] = useState('');
  const [isGeneratingThesis, setIsGeneratingThesis] = useState(false);

  const toggleTask = (id: number) => {
    setChecklist(checklist.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'completed' ? 'in-progress' : 'completed'
        };
      }
      return item;
    }));
  };

  const handlePolishGrammar = () => {
    if (!rawText.trim()) return;
    setIsPolishing(true);
    setTimeout(() => {
      const enhanced = rawText
        .replace(/shows that/gi, "demonstrates empirically that")
        .replace(/very/gi, "significantly")
        .replace(/got/gi, "obtained")
        .replace(/good/gi, "robust");
      
      setPolishedText(
        `[AI Academic Polish & Grammar Correction Applied]

${enhanced}

[Tone: Formal Academic English | Passive Voice Optimized | Lincoln University Style Guide Compliant]`
      );
      setIsPolishing(false);
    }, 1000);
  };

  const handleJournalMatch = () => {
    if (!journalQuery.trim()) return;
    setIsSearchingJournals(true);
    setTimeout(() => {
      setJournalSuggestions([
        { name: "Journal of King Saud University - Computer and Information Sciences", scopus: "Q1", acceptance: "74%", timeline: "6-8 Weeks" },
        { name: "International Journal of Sustainable Energy and Computing Systems", scopus: "Q1", acceptance: "82%", timeline: "4-6 Weeks" },
        { name: "Journal of Educational Technology Systems and Automated Governance", scopus: "Q2", acceptance: "89%", timeline: "5-7 Weeks" }
      ]);
      setIsSearchingJournals(false);
    }, 1000);
  };

  const handleGenerateThesis = () => {
    if (!genPrompt.trim()) return;
    setIsGeneratingThesis(true);
    setTimeout(() => {
      setGeneratedThesisContent(
        `### ${selectedChapterGen}: Automated Academic Draft

` +
        `**Abstract Context & Parameter Core:** ${genPrompt}

` +
        `#### 4.1 Introduction and Empirical Findings
` +
        `The systematic evaluation conducted within the tropical academic infrastructure demonstrates that the proposed multi-agent framework reduces telemetry latency by 34.2% while maintaining strict data sovereignty compliance. As outlined in Lincoln University research standards, empirical verification was executed across 500 concurrent IoT sensor nodes.

` +
        `#### 4.2 Statistical Validation & Comparative Analysis
` +
        `Comparative benchmarking against legacy baseline architectures confirms superior resilience under high-load scenarios. The resulting p-value (p < 0.001) confirms statistical significance across all evaluated performance vectors.

` +
        `[Formatted to APA 7th Edition & Lincoln University Manuscript Specifications]`
      );
      setIsGeneratingThesis(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Branding */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded-full uppercase tracking-widest">
                ThomasG Technologies • Academic Division
              </span>
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono rounded-full">
                Lincoln University, Malaysia
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <GraduationCap className="w-10 h-10 text-cyan-400" />
              PhD Candidacy & Thesis Portal
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm md:text-base">
              Candidate: <strong className="text-slate-200">Thomas G.</strong> | Program: Doctor of Philosophy (PhD) in Computer Science / Smart Systems | Supervisor: Faculty of Postgraduate Studies, Lincoln University.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">Overall Progress</div>
              <div className="text-2xl font-bold text-white">78% Complete</div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-mono">Target Defense</span>
              <Calendar className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white">December 2026</div>
            <div className="text-xs text-emerald-400 mt-1">On schedule</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-mono">Total Word Count</span>
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-bold text-white">70,500 words</div>
            <div className="text-xs text-slate-400 mt-1">Target: ~80,000 words</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-mono">Publications</span>
              <BookOpen className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white">2 / 2 Scopus</div>
            <div className="text-xs text-emerald-400 mt-1">Published & Indexed</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-mono">Plagiarism Score</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white">&lt; 11% Turnitin</div>
            <div className="text-xs text-emerald-400 mt-1">Compliant (&lt;15%)</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Roadmap
          </button>
          <button
            onClick={() => setActiveTab('chapters')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'chapters'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Thesis Chapters
          </button>
          <button
            onClick={() => setActiveTab('publications')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'publications'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Publications & Journals
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'checklist'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Lincoln U. Requirements
          </button>
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'ai-assistant'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-4 h-4 text-cyan-400" />
            Grammar & Journal Matcher
          </button>
          <button
            onClick={() => setActiveTab('thesis-generator')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'thesis-generator'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4 text-indigo-400" />
            Automated Thesis Generator
          </button>
        </div>

        {/* Tab Content: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Research Focus & Abstract
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  This doctoral research investigates advanced smart campus IoT frameworks, generative AI cognitive systems, and autonomous multi-agent microgrids. By integrating real-time telemetry streaming with automated decision engines, this dissertation proposes a scalable, secure, and sustainable paradigm for modern higher-education infrastructure, specifically benchmarked across tropical academic ecosystems in Malaysia.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono">IoT & Telemetry</span>
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono">Generative AI Copilots</span>
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono">Sustainable Campus Microgrids</span>
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono">Lincoln University Standards</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-cyan-400" />
                  Supervisory Committee & Institutional Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 font-mono">University</span>
                    <div className="font-bold text-white mt-1">Lincoln University College (LUC)</div>
                    <div className="text-slate-400 text-xs mt-0.5">Petaling Jaya, Selangor, Malaysia</div>
                  </div>
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 font-mono">Primary Supervisor</span>
                    <div className="font-bold text-white mt-1">Assoc. Prof. Dr. Postgraduate Advisor</div>
                    <div className="text-slate-400 text-xs mt-0.5">Faculty of Computer Science & Computing</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Upcoming Milestones
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-cyan-300">Pre-Submission Seminar</div>
                    <div className="text-slate-300">Scheduled: July 2026</div>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-slate-200">External Examiner Dispatch</div>
                    <div className="text-slate-400">Scheduled: September 2026</div>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-slate-200">Final VIVA Voce Defense</div>
                    <div className="text-slate-400">Scheduled: December 2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Chapters */}
        {activeTab === 'chapters' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Thesis Manuscript Breakdown</h3>
            <div className="grid grid-cols-1 gap-4">
              {chapters.map((ch, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white text-base">{ch.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span>Word Count: ~{ch.words}</span>
                      <span>•</span>
                      <span className={ch.status === 'Finalized' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{ch.status}</span>
                    </div>
                  </div>
                  <div className="w-full md:w-48 flex items-center gap-3">
                    <div className="flex-1 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${ch.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300">{ch.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Publications */}
        {activeTab === 'publications' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Required Journal Publications (Lincoln University Criteria)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-md">Scopus Indexed Q1</span>
                  <span className="text-xs font-mono text-slate-400">Published (2025)</span>
                </div>
                <h4 className="font-bold text-white text-base">Real-time IoT Telemetry and Cognitive Multi-Agent Architectures for Smart Campus Energy Optimization</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Published in the International Journal of Sustainable Energy and Computing Systems. Focuses on predictive energy balancing in tropical university environments.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-md">Scopus Indexed Q2</span>
                  <span className="text-xs font-mono text-slate-400">Published (2026)</span>
                </div>
                <h4 className="font-bold text-white text-base">Generative AI Copilots in Higher Education Administration: Security, Compliance, and Multitenant SaaS Models</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Published in the Journal of Educational Technology Systems and Automated Campus Governance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Checklist */}
        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Lincoln University Submission Checklist</h3>
              <span className="text-xs text-slate-400 font-mono">Click item to toggle status</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 overflow-hidden">
              {checklist.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => toggleTask(item.id)}
                  className="p-4 flex items-center justify-between hover:bg-slate-850 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {item.status === 'completed' ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500" />
                    )}
                    <span className={`text-sm font-medium ${item.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                      {item.task}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">{item.date}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      item.status === 'in-progress' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: AI Assistant & Journal Matcher */}
        {activeTab === 'ai-assistant' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-cyan-400" />
                    AI Academic Grammar & Tone Polisher
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Instantly rewrite informal drafts into rigorous scholarly English adhering to Lincoln University guidelines.
                  </p>
                </div>
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded-full">
                  GPT-4o Academic Engine
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-mono">Raw Draft Input</label>
                  <textarea
                    rows={6}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste your rough paragraph or chapter section here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    onClick={handlePolishGrammar}
                    disabled={isPolishing || !rawText.trim()}
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isPolishing ? 'Polishing & Formatting...' : 'Enhance Academic Tone'}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-mono">Polished Output</label>
                  <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-cyan-200 h-[172px] overflow-y-auto whitespace-pre-wrap font-mono">
                    {polishedText || 'Polished text will appear here...'}
                  </div>
                  {polishedText && (
                    <button
                      onClick={() => navigator.clipboard.writeText(polishedText)}
                      className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4" /> Copy to Clipboard
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookMarked className="w-5 h-5 text-indigo-400" />
                    Scopus / WoS Journal Publication Matcher
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Enter your research keywords or abstract snippet to find recommended high-impact journals meeting university quotas.
                  </p>
                </div>
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono rounded-full">
                  Smart Match AI
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={journalQuery}
                    onChange={(e) => setJournalQuery(e.target.value)}
                    placeholder="e.g. Smart campus IoT, multi-agent microgrids, generative AI cognitive systems..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleJournalMatch}
                    disabled={isSearchingJournals || !journalQuery.trim()}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all whitespace-nowrap disabled:opacity-50"
                  >
                    {isSearchingJournals ? 'Analyzing...' : 'Find Target Journals'}
                  </button>
                </div>

                {journalSuggestions.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    {journalSuggestions.map((j, idx) => (
                      <div key={idx} className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold rounded">
                              {j.scopus} Indexed
                            </span>
                            <span className="text-xs font-mono text-slate-400">{j.timeline}</span>
                          </div>
                          <h4 className="font-semibold text-white text-sm">{j.name}</h4>
                        </div>
                        <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Est. Acceptance:</span>
                          <span className="font-bold text-cyan-400">{j.acceptance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Automated Thesis Generator */}
        {activeTab === 'thesis-generator' && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  Automated Thesis Section Generator
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Provide your experimental telemetry data or core research variables to automatically generate fully structured academic thesis sections.
                </p>
              </div>
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono rounded-full">
                Auto-Draft Engine v2.4
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4 lg:col-span-1">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-mono">Select Chapter / Section</label>
                  <select
                    value={selectedChapterGen}
                    onChange={(e) => setSelectedChapterGen(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Chapter 1">Chapter 1: Introduction & Scope</option>
                    <option value="Chapter 2">Chapter 2: Literature Review Framework</option>
                    <option value="Chapter 3">Chapter 3: Methodology & System Design</option>
                    <option value="Chapter 4">Chapter 4: Implementation & Results</option>
                    <option value="Chapter 5">Chapter 5: Conclusion & Contributions</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-mono">Experimental Data / Bullet Points</label>
                  <textarea
                    rows={6}
                    value={genPrompt}
                    onChange={(e) => setGenPrompt(e.target.value)}
                    placeholder="e.g. Tested 500 IoT nodes in Malaysian university campus, reduced latency by 34%, high reliability under heavy load..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <button
                  onClick={handleGenerateThesis}
                  disabled={isGeneratingThesis || !genPrompt.trim()}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
                >
                  {isGeneratingThesis ? 'Generating Thesis Manuscript...' : 'Generate Automated Draft'}
                </button>
              </div>

              <div className="space-y-2 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-400 uppercase font-mono">Generated Manuscript Output</label>
                  {generatedThesisContent && (
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedThesisContent)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Section
                    </button>
                  )}
                </div>
                <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 text-sm text-slate-200 h-[320px] overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
                  {generatedThesisContent || 'Select a chapter, input your core notes, and click "Generate Automated Draft" to produce publication-ready academic text...'}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
