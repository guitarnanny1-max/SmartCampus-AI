'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartTeacherPrepPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [teacherName, setTeacherName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [topic, setTopic] = useState('');
  const [prepType, setPrepType] = useState('SUBJECT_PREP');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/smart-teacher-prep')
      .then(res => res.json())
      .then(data => setRecords(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName || !subjectName || !topic) return;
    setLoading(true);

    try {
      const res = await fetch('/api/smart-teacher-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherName, subjectName, topic, prepType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRecords([data, ...records]);
      setTopic('');
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
              GEMINI AI TEACHER HUB 🎓
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1">Subject Preparation & Seminar Planner</h1>
            <p className="text-xs text-purple-200/70">Generate structured lesson plans and professional presentation outlines instantly with Gemini AI.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 text-xs font-semibold border border-purple-800 transition-all"
          >
            ← Back to Portal
          </Link>
        </div>

        {/* Generator Form */}
        <form onSubmit={handleGenerate} className="bg-[#130d2a]/60 border border-purple-900/50 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-purple-300">Teacher Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Alan Turing" 
                value={teacherName}
                onChange={e => setTeacherName(e.target.value)}
                required
                className="w-full bg-[#0b0718] border border-purple-900/60 rounded-xl px-4 py-3 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-purple-300">Subject / Course Name</label>
              <input 
                type="text" 
                placeholder="e.g. Advanced Computer Science" 
                value={subjectName}
                onChange={e => setSubjectName(e.target.value)}
                required
                className="w-full bg-[#0b0718] border border-purple-900/60 rounded-xl px-4 py-3 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-purple-300">Specific Topic or Concept</label>
              <input 
                type="text" 
                placeholder="e.g. Quantum Cryptography & Qubits" 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                required
                className="w-full bg-[#0b0718] border border-purple-900/60 rounded-xl px-4 py-3 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-purple-300">Generation Type</label>
              <select 
                value={prepType}
                onChange={e => setPrepType(e.target.value)}
                className="w-full bg-[#0b0718] border border-purple-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="SUBJECT_PREP">📚 Subject Lesson Plan & Study Prep</option>
                <option value="SEMINAR_PRESENTATION">📊 Seminar Slide Presentation Outline</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Gemini AI Generating...' : 'Generate with Gemini AI →'}
            </button>
          </div>
        </form>

        {/* History & Output List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>✨</span> Generated Teacher Materials ({records.length})
          </h3>

          <div className="space-y-4">
            {records.map((rec) => (
              <div key={rec.id} className="bg-[#130d2a]/70 border border-purple-900/50 rounded-2xl p-6 space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs border-b border-purple-900/40 pb-3">
                  <div>
                    <span className="font-bold text-white">{rec.teacherName}</span>
                    <span className="text-purple-300/60 mx-2">•</span>
                    <span className="text-purple-300 font-semibold">{rec.subjectName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      rec.prepType === 'SEMINAR_PRESENTATION' 
                        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' 
                        : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                    }`}>
                      {rec.prepType === 'SEMINAR_PRESENTATION' ? '📊 Seminar Outline' : '📚 Lesson Plan'}
                    </span>
                    <span className="text-[10px] text-purple-300/50 font-mono">{new Date(rec.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-purple-300 mb-1">Topic: {rec.topic}</h4>
                  <div className="bg-[#0b0718] border border-purple-900/60 rounded-xl p-4 text-xs text-purple-100 whitespace-pre-line font-mono leading-relaxed">
                    {rec.aiOutput}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
