export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { Sparkles, BookOpen, FileText, CheckCircle2, ArrowLeft, Send, Download } from 'lucide-react';
import Link from 'next/link';

export default function AcademicsModule() {
  const [subject, setSubject] = useState('Mathematics');
  const [grade, setGrade] = useState('Grade 10');
  const [topic, setTopic] = useState('Quadratic Equations and Real-world Applications');
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGeneratedContent(null);

    setTimeout(() => {
      setGenerating(false);
      setGeneratedContent({
        title: `${topic} (${grade} ${subject})`,
        objectives: [
          'Understand the standard form of quadratic equations: ax² + bx + c = 0',
          'Solve equations using factorization and the quadratic formula',
          'Apply discriminant rules to determine the nature of roots',
          'Solve practical word problems involving projectile motion and profit calculation'
        ],
        duration: '45 Minutes (1 Period)',
        quiz: [
          {
            q: 'What is the discriminant formula for ax² + bx + c = 0?',
            options: ['A) b² - 4ac', 'B) b + 4ac', 'C) 2b - 4ac', 'D) a² - 4bc'],
            answer: 'A) b² - 4ac'
          },
          {
            q: 'If the discriminant is greater than 0, the roots are:',
            options: ['A) Real and Equal', 'B) Real and Distinct', 'C) Imaginary', 'D) Undefined'],
            answer: 'B) Real and Distinct'
          }
        ]
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus OS</h1>
            <span className="text-[10px] text-slate-400">AI Lesson Planner & Curriculum Generator</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">AI Pedagogical Assistant</h2>
            <p className="text-xs text-slate-400 mt-1">Generate CBSE/ICSE curriculum-aligned lesson plans, rubrics, and automated assessments in seconds.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5" /> AI Engine Ready
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Input */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Lesson Parameters</span>
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Computer Science</option>
                  <option>English Literature</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Grade Level</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option>Grade 8</option>
                  <option>Grade 9</option>
                  <option>Grade 10</option>
                  <option>Grade 11 Science</option>
                  <option>Grade 12 Science</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Specific Lesson Topic</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Photosynthesis or Newton's Laws"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generating ? 'AI Generating Lesson...' : 'Generate Lesson & Quiz'}</span>
              </button>
            </form>
          </div>

          {/* Generated Output Display */}
          <div className="lg:col-span-2 p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Generated Curriculum Output</span>
              </h3>
              {generatedContent && (
                <button 
                  onClick={() => alert('Lesson plan exported successfully to PDF & Teacher Gradebook!')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" /> Export Plan
                </button>
              )}
            </div>

            {!generatedContent ? (
              <div className="py-24 text-center text-xs text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
                <p>Configure your lesson parameters on the left and click generate to build an AI-powered lesson plan.</p>
              </div>
            ) : (
              <div className="space-y-6 text-xs text-slate-300">
                <div className="p-4 bg-slate-950 border border-cyan-500/30 rounded-2xl space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">Lesson Title & Duration</div>
                  <div className="text-base font-extrabold text-white">{generatedContent.title}</div>
                  <div className="text-slate-400">Estimated Duration: {generatedContent.duration}</div>
                </div>

                <div className="space-y-3">
                  <div className="font-bold text-white text-sm">Key Learning Objectives</div>
                  <ul className="space-y-2">
                    {generatedContent.objectives.map((obj: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="font-bold text-white text-sm">Automated Assessment Quiz</div>
                  <div className="space-y-4">
                    {generatedContent.quiz.map((qItem: any, i: number) => (
                      <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                        <div className="font-bold text-white">Q{i+1}. {qItem.q}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {qItem.options.map((opt: string, j: number) => (
                            <div key={j} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
                              {opt}
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 text-[11px] text-cyan-400 font-semibold">Correct Answer: {qItem.answer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
