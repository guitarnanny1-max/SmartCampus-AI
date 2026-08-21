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
  BarChart3,
  ArrowRight
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0f0b1e] text-white selection:bg-[#e8d0a9] selection:text-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e8d0a9]/10 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e8d0a9]/30 bg-[#16102f] px-4 py-1.5 text-xs font-bold text-[#e8d0a9] uppercase tracking-wider shadow-lg">
            <Sparkles className="h-3.5 w-3.5" /> Intelligent School Management
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
            SmartCampus AI — <span className="text-[#e8d0a9]">Features</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-semibold text-[#e8d0a9]">
            Let AI help you run your school.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
            SmartCampus AI is a 360° School Operating System designed to bring your school’s admissions, operations, academics, engagement, data, and automation together on one intelligent platform.
          </p>
        </div>
      </section>

      {/* AI Command Center */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Intelligence</span>
            <h2 className="text-3xl font-extrabold tracking-tight">🤖 AI Command Center</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Turn school data into actionable intelligence.
            </p>
            <div className="p-3 rounded-xl bg-[#16102f] border border-[#e8d0a9]/20 text-[11px] font-mono text-[#e8d0a9]">
              Understand → Predict → Recommend → Automate
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "AI-powered recommendations",
                "Attendance risk detection",
                "Fee collection insights",
                "Admission lead prioritization",
                "Operational alerts",
                "Automated workflows",
                "Intelligent decision support"
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

      {/* Admissions CRM */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "AI enquiry capture",
                "Lead qualification",
                "Admission pipeline",
                "Follow-up management",
                "Demo scheduling",
                "Application tracking",
                "Conversion analytics",
                "Complete communication history"
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-[#e8d0a9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-[#16102f] border border-white/10 text-[10px] text-slate-400 overflow-x-auto font-mono">
              Visitor → Enquiry → Lead → Qualification → Follow-up → Application → Admission
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Growth</span>
            <h2 className="text-3xl font-extrabold tracking-tight">🎯 Admissions CRM</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Turn enquiries into admissions with a structured growth engine.
            </p>
          </div>
        </div>
      </section>

      {/* Sales CRM */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Sales</span>
            <h2 className="text-3xl font-extrabold tracking-tight">💼 Sales CRM</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Give your sales team one workspace to manage every opportunity.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Lead management",
                "Sales pipeline",
                "Task and follow-up management",
                "Sales team assignment",
                "Customer interaction history",
                "Conversion tracking",
                "Performance analytics"
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

      {/* Student Management */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Student profiles",
                "Parent and guardian records",
                "Classes and sections",
                "Academic history",
                "Documents",
                "Student status lifecycle",
                "Search and bulk operations",
                "Audit history"
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-[#e8d0a9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Students</span>
            <h2 className="text-3xl font-extrabold tracking-tight">👨‍🎓 Student Management</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Maintain a complete digital record throughout the student lifecycle.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Management */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Academics</span>
            <h2 className="text-3xl font-extrabold tracking-tight">📚 Academic Management</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Connect teachers, students, attendance and academic performance.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Attendance",
                "Exams and assessments",
                "Results and gradecards",
                "Academic performance",
                "Smart timetable",
                "Teacher-subject management",
                "Academic analytics"
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

      {/* Fees & Collections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Fee structures",
                "Payment tracking",
                "Pending fee monitoring",
                "Automated reminders",
                "Collection analytics",
                "Reconciliation workflows",
                "Finance insights"
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-[#e8d0a9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Finance</span>
            <h2 className="text-3xl font-extrabold tracking-tight">💳 Fees & Collections</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Make fee operations simpler and more transparent.
            </p>
          </div>
        </div>
      </section>

      {/* Teacher & Staff Management */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Workforce</span>
            <h2 className="text-3xl font-extrabold tracking-tight">👩‍🏫 Teacher & Staff Management</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Manage your school's workforce from one centralized system.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Teacher profiles",
                "Employee records",
                "Staff attendance",
                "Role-based access",
                "Department management",
                "Staff workflows",
                "Audit-ready records"
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
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Vehicle management",
                "Driver records",
                "Route management",
                "Student transport allocation",
                "Fleet operations",
                "Transport records"
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-[#e8d0a9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Logistics</span>
            <h2 className="text-3xl font-extrabold tracking-tight">🚌 Transport & Fleet</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Digitize school transportation operations.
            </p>
          </div>
        </div>
      </section>

      {/* Parent & Student Engagement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Engagement</span>
            <h2 className="text-3xl font-extrabold tracking-tight">💬 Parent & Student Engagement</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Keep your school community connected.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Parent Portal",
                "Student App",
                "Notifications",
                "WhatsApp integration",
                "SMS communication",
                "Automated alerts",
                "Communication history"
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

      {/* Reports & Analytics */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Attendance analytics",
                "Fee analytics",
                "Admissions analytics",
                "Student performance",
                "Operational reports",
                "Management dashboards",
                "AI-powered insights"
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex items-center gap-2.5 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-[#e8d0a9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Analytics</span>
            <h2 className="text-3xl font-extrabold tracking-tight">📊 Reports & Analytics</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              See what is happening across your school.
            </p>
          </div>
        </div>
      </section>

      {/* Automation Engine */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/10 text-center space-y-6">
        <div className="rounded-3xl border border-[#e8d0a9]/30 bg-[#16102f] p-10 space-y-6 shadow-2xl">
          <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#1f173d] px-3 py-1 rounded-full border border-white/10">Automation</span>
          <h2 className="text-3xl font-extrabold tracking-tight">⚡ Automation Engine</h2>
          <p className="text-sm font-semibold text-slate-300">SmartCampus AI connects school data with intelligent workflows.</p>
          <div className="inline-block p-4 rounded-2xl bg-[#1f173d] border border-[#e8d0a9]/30 text-xs font-mono text-[#e8d0a9] shadow-inner">
            AI → Data → Recommendation → Action → Automation
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Automate repetitive tasks, trigger notifications, schedule workflows and connect external systems through integrations and webhooks.
          </p>
        </div>
      </section>

      {/* Enterprise-Ready Architecture */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Security & Scale</span>
          <h2 className="text-3xl font-extrabold tracking-tight">🔐 Enterprise-Ready Architecture</h2>
          <p className="text-xs sm:text-sm text-slate-400">Built for schools that need security, scalability and control.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            "Multi-tenant SaaS architecture",
            "Role-Based Access Control",
            "Secure authentication",
            "Tenant-aware data access",
            "Comprehensive audit trails",
            "Status-based lifecycle management",
            "Scalable school data foundation"
          ].map((feature, idx) => (
            <div key={idx} className="rounded-2xl border border-white/10 bg-[#16102f] p-4 text-xs font-semibold text-slate-200 flex flex-col justify-between shadow-md space-y-3">
              <ShieldCheck className="h-5 w-5 text-[#e8d0a9]" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Future Campus Intelligence */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/10 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Future-Ready</span>
          <h2 className="text-3xl font-extrabold tracking-tight">⚡ Future Campus Intelligence</h2>
          <p className="text-xs sm:text-sm text-slate-300">SmartCampus AI is designed to evolve beyond traditional school ERP.</p>
        </div>

        <div className="rounded-3xl border border-[#e8d0a9]/30 bg-[#16102f] p-8 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#e8d0a9]" /> Power & Facility Management
          </h3>
          <p className="text-xs text-slate-300">Future capabilities can include:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            {[
              "Timetable-synchronized HVAC control",
              "Automated classroom lighting",
              "Campus energy monitoring",
              "Power consumption analytics",
              "Facility utilization monitoring",
              "Smart equipment management",
              "AI energy-saving recommendations",
              "Automated shutdown of unused facilities"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1f173d] border border-white/5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#e8d0a9] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-white/5">
            This creates a path from school management software to intelligent campus infrastructure.
          </p>
        </div>
      </section>

      {/* Conclusion Footer Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-4 border-t border-white/10">
        <h3 className="text-lg font-black text-white">One Intelligent School Operating System</h3>
        <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
          From the first enquiry to daily school operations, SmartCampus AI connects the entire journey.
        </p>
        <div className="p-3 rounded-2xl bg-[#16102f] border border-white/10 text-[11px] text-[#e8d0a9] font-mono inline-block">
          Admissions CRM + Sales CRM + Students + Academics + Fees + Staff + Transport + Engagement + AI + Automation
        </div>
        <div className="pt-4 space-y-1">
          <p className="text-xs font-bold text-white">SmartCampus AI — 360° School Operating System</p>
          <p className="text-[11px] text-slate-400 italic">Let AI help you run your school.</p>
          <p className="text-xs font-bold text-[#e8d0a9] pt-2">Powered by ThomasG Technologies</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
