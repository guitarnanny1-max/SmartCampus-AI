export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartExamProctorPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [examTitle, setExamTitle] = useState('');
  const [studentName, setStudentName] = useState('');
  const [rawAnswerText, setRawAnswerText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/smart-exam-proctor')
      .then(res => res.json())
      .then(data => setRecords(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle || !studentName || !rawAnswerText) return;
    setLoading(true);

    try {
      const res = await fetch('/api/smart-exam-proctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examTitle, studentName, rawAnswerText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRecords([data, ...records]);
      setRawAnswerText('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090616] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#130d2a]/80 border border-purple-900/50 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-800">
              AI EXAM & PROCTORING ENGINE 🛡️
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1">Automated Grading & Proctoring Hub</h1>
            <p className="text-xs text-purple-200/70">Evaluate student exam essays and code submissions instantly with automated AI scoring.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 text-xs font-semibold border border-purple-800 transition-all"
          >
            ← Back to Portal
          </Link>
        </div>

        {/* Submission & Grading Form */}
        <form onSubmit={handleGradeSubmission} className="bg-[#130d2a]/60 border border-purple-900/50 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-purple-300">Exam / Assignment Title</label>
              <input 
                type="text" 
                placeholder="e.g. CS-401 Midterm AI Architecture" 
                value={examTitle}
                onChange={e => setExamTitle(e.target.value)}
                required
                className="w-full bg-[#0b0718] border border-purple-900/60 rounded-xl px-4 py-3 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-purple-300">Student Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Jane Doe" 
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                required
                className="w-full bg-[#0b0718] border border-purple-900/60 rounded-xl px-4 py-3 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-purple-300">Student Answer / Essay / Code Content</label>
            <textarea 
              rows={4}
              placeholder="Paste student response here for instant AI grading and anti-cheating audit..."
              value={rawAnswerText}
              onChange={e => setRawAnswerText(e.target.value)}
              required
              className="w-full bg-[#0b0718] border border-purple-900/60 rounded-xl p-4 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'AI Grading in Progress...' : 'Grade Submission with AI →'}
            </button>
          </div>
        </form>

        {/* History List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>📝</span> Evaluated Exam Submissions ({records.length})
          </h3>

          <div className="space-y-4">
            {records.map((rec: any) => (
              <div key={rec.id} className="bg-[#130d2a]/70 border border-purple-900/50 rounded-2xl p-6 space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs border-b border-purple-900/40 pb-3">
                  <div>
                    <span className="font-bold text-white">{rec.studentName}</span>
                    <span className="text-purple-300/60 mx-2">•</span>
                    <span className="text-purple-300 font-semibold">{rec.examTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      rec.status === 'EXCELLENCE_HONORS' 
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : rec.status === 'PASSED'
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      Score: {rec.score}% ({rec.status})
                    </span>
                    <span className="text-[10px] text-purple-300/50 font-mono">{new Date(rec.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="bg-[#0b0718] border border-purple-900/60 rounded-xl p-3.5 text-xs text-purple-200">
                  <span className="font-bold text-purple-400">🤖 AI Evaluator Feedback:</span> {rec.aiFeedback}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
