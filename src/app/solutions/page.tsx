export const revalidate = 0;
export const dynamic = 'force-dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Users, 
  BookOpen, 
  CreditCard, 
  MessageSquare, 
  Briefcase, 
  Truck, 
  BrainCircuit, 
  Database, 
  Zap,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-[#0f0b1e] text-white selection:bg-[#e8d0a9] selection:text-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e8d0a9]/10 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e8d0a9]/30 bg-[#16102f] px-4 py-1.5 text-xs font-bold text-[#e8d0a9] uppercase tracking-wider shadow-lg">
            <Sparkles className="h-3.5 w-3.5" /> Solutions & Capabilities
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
            SmartCampus AI — <span className="text-[#e8d0a9]">Solutions</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            SmartCampus AI brings the essential systems of a modern school together on one intelligent platform. Instead of managing disconnected applications, spreadsheets, communication tools, and manual processes, schools get a unified operating layer designed to connect people, data, workflows, and AI.
          </p>
        </div>
      </section>

      {/* AI-Powered School Operations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Operations</span>
            <h2 className="text-3xl font-extrabold tracking-tight">AI-Powered School Operations</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Give administrators a real-time view of what is happening across the campus.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "AI-powered insights and recommendations",
                "Automated operational workflows",
                "Real-time dashboards and alerts",
                "Role-based access and approvals",
                "Centralized school data"
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-[#e8d0a9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Admissions & Growth */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "AI Chatbot for website enquiries",
                "Lead capture and qualification",
                "Admissions CRM pipeline",
                "Follow-up management",
                "Demo and enquiry tracking",
                "Application-to-admission workflow",
                "Conversion analytics"
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-[#e8d0a9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Growth</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Admissions & Growth</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Turn every enquiry into a structured, trackable admissions journey.
            </p>
          </div>
        </div>
      </section>

      {/* Student Management */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Students</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Student Management</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Create a reliable digital record for every student throughout their school journey.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Student profiles",
                "Classes and sections",
                "Parent/guardian information",
                "Documents and records",
                "Student status lifecycle",
                "Academic history",
                "Attendance integration"
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-[#e8d0a9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Academics */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Attendance",
                "Exams and assessments",
                "Results and gradecards",
                "Smart timetable",
                "Academic performance insights",
                "Teacher and student workflows"
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-[#e8d0a9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Academics</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Academics</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Connect academic operations with the wider school ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Fees & Collections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Finance</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Fees & Collections</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Make fee management more transparent and efficient.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Fee structures",
                "Collection tracking",
                "Pending-fee monitoring",
                "Payment records",
                "Automated reminders",
                "Reconciliation workflows",
                "AI-driven collection insights"
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-[#e8d0a9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parent & Student Engagement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Parent Portal",
                "Student App",
                "Notifications",
                "WhatsApp/SMS integrations",
                "Communication history",
                "Important school alerts"
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-[#e8d0a9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Engagement</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Parent & Student Engagement</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Keep families connected through the channels they already use.
            </p>
          </div>
        </div>
      </section>

      {/* Staff & School Administration */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Administration</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Staff & School Administration</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Support the people who keep the school running.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Teacher and staff management",
                "Staff attendance",
                "Role-based permissions",
                "HR workflows",
                "Operational records",
                "Audit history"
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-[#e8d0a9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transport & Fleet */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Vehicle management",
                "Driver management",
                "Route management",
                "Student transport allocation",
                "Transport records",
                "Future-ready tracking integrations"
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-[#e8d0a9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Logistics</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Transport & Fleet</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bring school transportation into the same operational ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* AI Command Center */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/10 text-center space-y-6">
        <div className="rounded-3xl border border-[#e8d0a9]/30 bg-[#16102f] p-10 space-y-6 shadow-2xl">
          <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#1f173d] px-3 py-1 rounded-full border border-white/10">Intelligence</span>
          <h2 className="text-3xl font-extrabold tracking-tight">AI Command Center</h2>
          <p className="text-sm font-semibold text-slate-300">Turn school data into actionable intelligence.</p>
          <div className="inline-block p-4 rounded-2xl bg-[#1f173d] border border-[#e8d0a9]/30 text-xs font-mono text-[#e8d0a9] shadow-inner">
            Understand → Predict → Recommend → Automate
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
            SmartCampus AI can help identify attendance risks, highlight pending collections, prioritize admissions follow-ups, surface operational exceptions, and recommend the next action for administrators.
          </p>
        </div>
      </section>

      {/* Enterprise School Data Layer */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Architecture</span>
          <h2 className="text-3xl font-extrabold tracking-tight">Enterprise School Data Layer</h2>
          <p className="text-xs sm:text-sm text-slate-400">Built for schools that need more than a basic ERP.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            "Multi-tenant SaaS architecture",
            "Role-Based Access Control",
            "Audit trails",
            "Secure data foundation",
            "Scalable PostgreSQL architecture",
            "Modular school operations"
          ].map((feature, idx) => (
            <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex flex-col justify-between shadow-md space-y-3">
              <ShieldCheck className="h-5 w-5 text-[#e8d0a9]" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Future-Ready Campus Intelligence */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/10 text-center space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Future-Ready Campus Intelligence</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
          SmartCampus AI is designed to expand beyond traditional school ERP capabilities. Future solutions can include Power & Facility Management, including timetable-aware energy optimization, facility monitoring, automated HVAC and lighting controls, and campus resource intelligence.
        </p>
        <p className="text-xs text-slate-400 italic">
          This allows SmartCampus AI to evolve from a school management platform into a broader intelligent campus operating system.
        </p>
      </section>

      {/* Conclusion Footer Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-4 border-t border-white/10">
        <h3 className="text-lg font-black text-white">One Platform. One School Data Foundation. One Intelligent Future.</h3>
        <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
          SmartCampus AI connects admissions, students, academics, finance, staff, engagement, transport, and AI into one scalable school operating system.
        </p>
        <div className="pt-4 space-y-1">
          <p className="text-xs font-bold text-[#e8d0a9]">Powered by ThomasG Technologies.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
