"client";

import { Award, Quote, CheckCircle2, Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "SmartCampus transformed our fee collection workflow. We reduced administrative follow-up time by 75% and boosted on-time fee payments to 99.4% within the first semester.",
      author: "Dr. Jonathan Sterling",
      title: "Superintendent",
      institution: "Oakridge International Academy",
      stats: "3,400 Students • 100% Digital Adoption",
    },
    {
      quote: "The attendance sync and parent portal have eliminated countless phone calls. Parents love the instant push updates, and our teachers save hours every single week.",
      author: "Elena Rostova",
      title: "Head of Academic Operations",
      institution: "St. Jude Collegiate Institute",
      stats: "1,850 Students • Unified LMS & Fees",
    },
    {
      quote: "Migrating our multi-campus records to SmartCampus was seamless. The Supabase cloud architecture gives our IT department absolute peace of mind regarding data security.",
      author: "Marcus Vance",
      title: "Chief Technology Officer",
      institution: "Global Prep School Network",
      stats: "5 Campuses • Enterprise Tier",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#e8d0a9] bg-[#e8d0a9]/10 px-3.5 py-1.5 rounded-full border border-[#e8d0a9]/20 inline-flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5" /> Institutional Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Trusted by Leading Educational Institutions
          </h2>
          <p className="text-sm text-slate-300">
            Discover how deans, superintendents, and IT directors achieve operational excellence with SmartCampus.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div 
              key={index}
              className="rounded-3xl border border-white/10 bg-[#16102f] p-8 flex flex-col justify-between space-y-6 hover:border-[#e8d0a9]/40 transition-all shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-[#e8d0a9]/10 transition-colors pointer-events-none">
                <Quote className="h-20 w-20" />
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-1 text-[#e8d0a9]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10 relative z-10">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white">{item.author}</div>
                  <div className="text-[11px] text-[#e8d0a9]">{item.title}</div>
                  <div className="text-[11px] text-slate-400">{item.institution}</div>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" /> {item.stats}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
