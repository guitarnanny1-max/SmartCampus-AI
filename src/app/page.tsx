'use client';

import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  BarChart3,
  GraduationCap,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Building2,
  Clock,
  ChevronDown,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function SmartCampusLandingPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    schoolName: '',
    phone: '',
    role: 'Principal / Headmaster',
    studentSize: 'Under 500 Students',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              SmartCampus <span className="text-blue-500">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-blue-400 transition-colors">Solutions</a>
            <a href="#impact" className="hover:text-blue-400 transition-colors">Impact</a>
            <a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a>
          </nav>

          <a
            href="#demo"
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium text-sm text-white transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50"
          >
            Book Demo
          </a>
        </div>
      </header>

      {/* HERO SECTION & DEMO FORM */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Next-Gen Educational OS
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Transform Your Educational Institution with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">SmartCampus AI</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
              AI-driven automation, smart administrative workflows, and real-time campus insights designed for forward-thinking schools.
            </p>

            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-slate-800/80">
              <div>
                <p className="text-3xl font-bold text-white">85%</p>
                <p className="text-xs text-slate-400 mt-1">Reduction in Admin Bottlenecks</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="text-xs text-slate-400 mt-1">Automated Student Support</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-xs text-slate-400 mt-1">FERPA & GDPR Compliant</p>
              </div>
            </div>
          </div>

          {/* Hero Right: Booking Form */}
          <div id="demo" className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Book a SmartCampus AI Demo</h2>
                <p className="text-sm text-slate-400 mt-1">
                  See how SmartCampus AI automates operations and enhances student engagement.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Demo Request Received!</h3>
                  <p className="text-sm text-slate-400">
                    Thank you, <span className="text-white font-medium">{formData.fullName}</span>. One of our campus AI specialists will reach out shortly to schedule your personalized session.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Sarah Jenkins"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="s.jenkins@academy.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        School Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Oakridge Academy"
                        value={formData.schoolName}
                        onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    >
                      <option value="Principal / Headmaster">Principal / Headmaster</option>
                      <option value="IT Director / Technology Lead">IT Director / Technology Lead</option>
                      <option value="Administrator / Manager">Administrator / Manager</option>
                      <option value="Superintendent">Superintendent</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Student Size
                    </label>
                    <select
                      value={formData.studentSize}
                      onChange={(e) => setFormData({...formData, studentSize: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    >
                      <option value="Under 500 Students">Under 500 Students</option>
                      <option value="500 – 1,500 Students">500 – 1,500 Students</option>
                      <option value="1,500 – 3,000 Students">1,500 – 3,000 Students</option>
                      <option value="3,000+ Students">3,000+ Students</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-white text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
                  >
                    Request SmartCampus Demo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-20 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Purpose-Built AI for Campus Operations
            </h2>
            <p className="text-slate-400">
              Eliminate manual tasks, unify campus communications, and unlock predictive insights with our comprehensive educational suite.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Bot className="w-6 h-6 text-blue-400" />}
              title="24/7 AI Campus Concierge"
              description="Automate response handling for student inquiries, parent FAQs, and administrative support around the clock."
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6 text-indigo-400" />}
              title="Smart Administrative Workflows"
              description="Automatically generate transcripts, process enrollment forms, and manage staff schedules seamlessly."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-emerald-400" />}
              title="Real-Time Campus Analytics"
              description="Track attendance trends, academic performance, and resource usage with executive-level dashboards."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-purple-400" />}
              title="Parent & Student Hub"
              description="Centralize grade reports, event notifications, and direct messaging into a unified mobile interface."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-cyan-400" />}
              title="Enterprise Grade Security"
              description="Bank-grade encryption ensured with total FERPA, COPPA, and GDPR regulatory compliance built-in."
            />
            <FeatureCard
              icon={<Building2 className="w-6 h-6 text-amber-400" />}
              title="Facility & Resource Optimization"
              description="Intelligent scheduling for classrooms, labs, sports facilities, and campus maintenance needs."
            />
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 mt-2">Got questions about integrating SmartCampus AI into your school?</p>
        </div>

        <div className="space-y-4">
          <FaqItem
            index={1}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            question="How quickly can SmartCampus AI be deployed in our school?"
            answer="Most institutions deploy SmartCampus AI within 2 to 3 weeks. Our onboarding team handles integration with your existing Student Information System (SIS)."
          />
          <FaqItem
            index={2}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            question="Is student data safe and compliant?"
            answer="Absolutely. SmartCampus AI uses enterprise-grade encryption and strictly complies with FERPA, COPPA, and GDPR standards. Student data is never sold or used for training public AI models."
          />
          <FaqItem
            index={3}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            question="Can SmartCampus AI integrate with our existing SIS or LMS?"
            answer="Yes! We provide out-of-the-box integrations for Canvas, PowerSchool, Google Classroom, Blackboard, and custom REST API endpoints."
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-bold text-white">SmartCampus AI</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Empowering K-12 and Higher-Ed institutions with intelligent, secure campus automation.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security & FERPA</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Institution Types</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">K-12 Schools</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Higher Education</a></li>
              <li><a href="#" className="hover:text-white transition-colors">School Districts</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" /> contact@smartcampus.ai</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-500" /> +1 (800) 555-AI-EDU</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-500" /> San Francisco, CA</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-900 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} SmartCampus AI Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all hover:-translate-y-1">
      <div className="w-12 h-12 rounded-lg bg-slate-800/80 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function FaqItem({ index, openFaq, setOpenFaq, question, answer }: { index: number; openFaq: number | null; setOpenFaq: (i: number | null) => void; question: string; answer: string }) {
  const isOpen = openFaq === index;
  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden">
      <button
        onClick={() => setOpenFaq(isOpen ? null : index)}
        className="w-full px-6 py-4 text-left flex items-center justify-between text-white font-medium text-sm sm:text-base"
      >
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}
