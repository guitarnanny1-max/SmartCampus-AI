import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, Mail, Phone, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0f0b1e] text-white selection:bg-[#e8d0a9] selection:text-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e8d0a9]/10 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e8d0a9]/30 bg-[#16102f] px-4 py-1.5 text-xs font-bold text-[#e8d0a9] uppercase tracking-wider shadow-lg">
            <Sparkles className="h-3.5 w-3.5" /> Get in Touch
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
            Let's Talk About <span className="text-[#e8d0a9]">SmartCampus AI</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Have questions about our 360° School Operating System? Reach out to our team and discover how AI can help you run your school more efficiently.
          </p>
        </div>
      </section>

      {/* Contact Information & Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold tracking-tight">Contact Information</h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Get in touch with ThomasG Technologies directly through email or phone.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-[#16102f] shadow-md">
                <div className="p-3 rounded-xl bg-[#1f173d] text-[#e8d0a9]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Us</p>
                  <a href="mailto:info.smartcampusai@gmail.com" className="text-xs sm:text-sm font-semibold text-white hover:text-[#e8d0a9] transition-colors">
                    info.smartcampusai@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-[#16102f] shadow-md">
                <div className="p-3 rounded-xl bg-[#1f173d] text-[#e8d0a9]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Call Us</p>
                  <a href="tel:+919959679467" className="text-xs sm:text-sm font-semibold text-white hover:text-[#e8d0a9] transition-colors">
                    +91-9959-679467
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-[#e8d0a9]/30 bg-[#16102f] space-y-2 shadow-xl">
              <h3 className="text-xs font-bold text-[#e8d0a9] uppercase tracking-wider">Powered by ThomasG Technologies</h3>
              <p className="text-xs text-slate-300">
                SmartCampus AI — 360° School Operating System. Let AI help you run your school.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-[#16102f] p-8 space-y-6 shadow-xl">
              <h3 className="text-xl font-extrabold text-white">Send Us a Message</h3>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full rounded-xl border border-white/10 bg-[#1f173d] px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-[#e8d0a9] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">School / Organization</label>
                    <input 
                      type="text" 
                      placeholder="Springfield High" 
                      className="w-full rounded-xl border border-white/10 bg-[#1f173d] px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-[#e8d0a9] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@school.com" 
                      className="w-full rounded-xl border border-white/10 bg-[#1f173d] px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-[#e8d0a9] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 XXXXX XXXXX" 
                      className="w-full rounded-xl border border-white/10 bg-[#1f173d] px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-[#e8d0a9] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Message</label>
                  <textarea 
                    rows={4} 
                    placeholder="Tell us about your school and requirements..." 
                    className="w-full rounded-xl border border-white/10 bg-[#1f173d] px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-[#e8d0a9] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#e8d0a9] px-6 py-3.5 text-xs font-bold text-black hover:bg-[#d8c099] transition-colors shadow-lg cursor-pointer"
                >
                  <Send className="h-4 w-4" /> Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
