export const dynamic = "force-dynamic";
"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TeacherApp(props: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = use(props.params);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [topic, setTopic] = useState("");
  const [lessonPlan, setLessonPlan] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("smartcampus_user");
    if (!storedUser) {
      router.push(`/${subdomain}/login`);
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [subdomain, router]);

  function handleLogout() {
    localStorage.removeItem("smartcampus_user");
    router.push(`/${subdomain}/login`);
  }

  async function handleGenerateLesson(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || generating) return;

    setGenerating(true);
    setTimeout(() => {
      setLessonPlan(`AI Lesson Plan for: "${topic}"\n\n1. Learning Objectives: Understand core theoretical and practical applications.\n2. Introduction (10 mins): Real-world hook and foundational discussion.\n3. Core Concepts (25 mins): Step-by-step whiteboard breakdown.\n4. Interactive Activity (15 mins): Group problem-solving exercise.\n5. Assessment & Homework: Chapter review questions and quiz.`);
      setGenerating(false);
    }, 1200);
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center shadow-xl">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Educator Portal Workspace</span>
            <h1 className="text-3xl font-black mt-1">Teacher Dashboard ({subdomain})</h1>
            <p className="text-sm text-slate-400">Manage classroom curriculum, review student rosters, and generate AI lesson plans.</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold uppercase">Role: {user.role} ({user.name})</span>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold uppercase transition cursor-pointer">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Roster */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="font-bold text-lg">Class 10-A Roster</h3>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-200">Rahul Gupta</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Attendance: Present</p>
                </div>
                <span className="text-cyan-400 font-bold">A+ (94%)</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-200">Priya Sharma</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Attendance: Present</p>
                </div>
                <span className="text-cyan-400 font-bold">A (90%)</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-200">Amit Verma</p>
                  <p className="text-[10px] text-amber-400 font-mono">Attendance: Late</p>
                </div>
                <span className="text-cyan-400 font-bold">B+ (85%)</span>
              </div>
            </div>
          </div>

          {/* Right Column: AI Lesson Plan Generator */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between h-[600px] shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-lg">AI Lesson Plan Generator</h3>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">Active 24/7</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">Enter any curriculum topic to instantly generate structured lesson plans and rubrics.</p>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex-1 overflow-y-auto space-y-3">
              {lessonPlan ? (
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">{lessonPlan}</pre>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-20">Enter a topic below to generate your AI-powered lesson plan.</p>
              )}
              {generating && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center animate-pulse">
                  <p className="text-xs text-amber-400">Generating comprehensive lesson plan...</p>
                </div>
              )}
            </div>

            <form onSubmit={handleGenerateLesson} className="flex gap-2 mt-4">
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic (e.g., Photosynthesis or Quadratic Equations)..." 
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <button type="submit" disabled={generating} className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition shadow-lg cursor-pointer disabled:opacity-50">
                Generate Plan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
