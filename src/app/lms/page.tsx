'use client';

import React, { useState } from 'react';
import { Sparkles, BookOpen, FileText, CheckCircle2, ArrowLeft, Award, Clock, Users, Upload, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function LMSModule() {
  const [selectedCourse, setSelectedCourse] = useState('Advanced Mathematics - Grade 12');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const courses = [
    { id: 1, title: 'Advanced Mathematics - Grade 12', teacher: 'Dr. R. Sharma', enrolled: 142, progress: '82%', status: 'Active' },
    { id: 2, title: 'Physics Laboratory & Quantum Mechanics', teacher: 'Prof. A. Verma', enrolled: 128, progress: '74%', status: 'Active' },
    { id: 3, title: 'Computer Science & Python Algorithms', teacher: 'Ms. Priya Sen', enrolled: 156, progress: '91%', status: 'Active' },
  ];

  const assignments = [
    { id: 1, title: 'Calculus Derivative Problem Set 4', course: 'Advanced Mathematics', dueDate: 'June 25, 2026', submissions: '138 / 142', status: 'Grading Open' },
    { id: 2, title: 'Quantum Electrodynamics Lab Report', course: 'Physics Laboratory', dueDate: 'June 28, 2026', submissions: '94 / 128', status: 'In Progress' },
    { id: 3, title: 'Data Structures & Sorting Trees Project', course: 'Computer Science', dueDate: 'July 02, 2026', submissions: '150 / 156', status: 'In Progress' },
  ];

  const handleUploadAssignment = () => {
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus SaaS OS</h1>
            <span className="text-[10px] text-slate-400">Learning Management System & Online Exams</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Institutional LMS & Examination Portal</h2>
            <p className="text-xs text-slate-400 mt-1">Manage course materials, upload homework assignments, conduct proctored online quizzes, and track student mastery.</p>
          </div>
          <button
            onClick={handleUploadAssignment}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Upload className="w-4 h-4" />
            <span>Publish New Assignment</span>
          </button>
        </div>

        {uploadSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>New assignment published successfully to all enrolled students in tenant schema!</span>
          </div>
        )}

        {/* LMS KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Active Enrolled Courses</div>
            <div className="text-3xl font-extrabold text-white">48 Classes</div>
            <div className="text-[10px] text-cyan-400 font-medium">100% curriculum synchronized</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Student Submission Rate</div>
            <div className="text-3xl font-extrabold text-white">96.4%</div>
            <div className="text-[10px] text-cyan-400 font-medium">+4.2% vs last term</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Average Quiz Score</div>
            <div className="text-3xl font-extrabold text-cyan-400">89.2%</div>
            <div className="text-[10px] text-slate-400">Automated AI grading active</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Proctored Exams Run</div>
            <div className="text-3xl font-extrabold text-white">124</div>
            <div className="text-[10px] text-cyan-400 font-medium">Zero security violations</div>
          </div>
        </div>

        {/* Courses & Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Courses List */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Active Course Catalog</span>
            </h3>

            <div className="space-y-3 text-xs">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course.title)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedCourse === course.title
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-white text-sm">{course.title}</div>
                  <div className="text-slate-400 flex items-center justify-between text-[11px]">
                    <span>Teacher: <strong className="text-slate-300">{course.teacher}</strong></span>
                    <span>Enrolled: <strong className="text-cyan-400">{course.enrolled}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments & Grading Table */}
          <div className="lg:col-span-2 p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Active Assignments & Quizzes</span>
              </h3>
              <span className="text-xs text-slate-400">{selectedCourse}</span>
            </div>

            <div className="space-y-3 text-xs">
              {assignments.map((item) => (
                <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{item.title}</div>
                    <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                      <span>Course: <strong className="text-slate-300">{item.course}</strong></span>
                      <span>Due: <strong className="text-slate-300">{item.dueDate}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-300 font-mono text-[11px]">Submissions: {item.submissions}</span>
                    <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full font-bold text-[10px]">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
