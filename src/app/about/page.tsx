export const revalidate = 0;
export const dynamic = 'force-dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Zap, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Network, 
  Database,
  TrendingUp,
  Workflow
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0f0b1e] text-white selection:bg-[#e8d0a9] selection:text-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e8d0a9]/10 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e8d0a9]/30 bg-[#16102f] px-4 py-1.5 text-xs font-bold text-[#e8d0a9] uppercase tracking-wider shadow-lg">
            <Sparkles className="h-3.5 w-3.5" /> About Us
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
            Building Intelligent Technology for the <span className="text-[#e8d0a9]">Future of Education</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            ThomasG Technologies is a technology company focused on building practical, intelligent and scalable digital solutions that help organizations operate more efficiently.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Our vision is to combine software, automation and artificial intelligence to simplify complex workflows, improve decision-making and create connected digital experiences.
          </p>
        </div>
      </section>

      {/* SmartCampus AI Platform Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] font-bold text-[#e8d0a9] uppercase tracking-widest bg-[#16102f] px-3 py-1 rounded-full border border-white/10">Flagship Platform</span>
            <h2 className="text-3xl font-extrabold tracking-tight">SmartCampus AI</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our flagship education technology platform, SmartCampus AI, is designed as a 360° School Operating System that brings school operations, academics, engagement, admissions and intelligence together on one unified platform.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Instead of managing multiple disconnected systems, schools can progressively bring their key workflows into one intelligent ecosystem.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-[#e8d0a9]/30 bg-[#16102f] p-8 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-2">SmartCampus AI is designed to help schools:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                {[
                  "Manage student and school operations",
                  "Manage admissions and sales enquiries",
                  "Improve attendance and academic visibility",
                  "Manage fees and collections",
                  "Connect teachers, students and parents",
                  "Automate repetitive administrative workflows",
                  "Use AI to identify risks and opportunities",
                  "Transform school data into actionable insights"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[#1f173d] border border-white/5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#e8d0a9] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI-First School Management */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight">AI-First School Management</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We believe the next generation of school software should do more than store information. It should understand what is happening, identify what needs attention, recommend what should happen next and, where appropriate, help automate the action.
          </p>
          <div className="pt-4">
            <div className="inline-block p-4 rounded-2xl bg-[#16102f] border border-[#e8d0a9]/30 text-xs font-mono text-[#e8d0a9] shadow-lg">
              Understand → Predict → Recommend → Automate
            </div>
          </div>
        </div>
      </section>

      {/* Built for Growth */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight">Built for Growth</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              SmartCampus AI is being designed with a scalable SaaS architecture that can support individual schools, growing institutions and eventually multi-campus organizations.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-[#16102f] p-8 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-2">Our platform direction emphasizes:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  "Multi-tenant architecture",
                  "Role-based access control",
                  "Secure data management",
                  "Auditable operations",
                  "Modular product architecture",
                  "Reusable workflows",
                  "AI-assisted decision making",
                  "Scalable integrations"
                ].map((feature, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/10 bg-[#1f173d] p-3 text-slate-200 flex flex-col justify-between space-y-2">
                    <ShieldCheck className="h-4 w-4 text-[#e8d0a9]" />
                    <span className="font-semibold text-[11px]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beyond School Administration */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/10 text-center space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Beyond School Administration</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Our long-term vision extends beyond traditional school ERP functionality. Future SmartCampus AI capabilities may include Power & Facility Management, intelligent campus infrastructure, IoT integrations, energy monitoring, smart HVAC and lighting automation, predictive maintenance and AI-driven facility optimization.
        </p>
        <p className="text-xs text-slate-400 italic">
          These capabilities represent our future product direction as the SmartCampus ecosystem expands.
        </p>
      </section>

      {/* Our Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/10 text-center space-y-6">
        <div className="rounded-3xl border border-[#e8d0a9]/30 bg-[#16102f] p-10 space-y-4 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Our Mission</h2>
          <p className="text-sm font-bold text-[#e8d0a9]">Make technology work for the people who run schools.</p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
            We want school leaders, administrators, teachers and support teams to spend less time managing disconnected systems and repetitive processes—and more time focusing on students, education and growth.
          </p>
        </div>
      </section>

      {/* Powered by ThomasG Technologies Footer Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-4">
        <h3 className="text-base font-black text-[#e8d0a9]">Powered by ThomasG Technologies</h3>
        <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
          ThomasG Technologies is building SmartCampus AI with a long-term vision of creating intelligent, connected and scalable technology for modern institutions.
        </p>
        <div className="pt-4 space-y-1">
          <p className="text-xs font-bold text-white">SmartCampus AI — 360° School Operating System</p>
          <p className="text-[11px] text-[#e8d0a9] font-medium">Let AI help you run your school.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
