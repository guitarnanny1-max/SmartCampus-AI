"client";

import { useState } from "react";
import { Sparkles, CheckCircle2, Loader2, Building, Mail, Phone, User, Users, FileText } from "lucide-react";

export default function DemoSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    schoolName: "",
    email: "",
    phone: "",
    studentCount: "1,000 - 3,000 students",
    requirements: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit demo request.");
      }

      setSuccess(true);
      setFormData({
        fullName: "",
        schoolName: "",
        email: "",
        phone: "",
        studentCount: "1,000 - 3,000 students",
        requirements: ""
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#e8d0a9]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="rounded-3xl border border-[#e8d0a9]/30 bg-[#16102f] p-8 sm:p-12 shadow-2xl relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8d0a9]/10 text-[#e8d0a9]">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Schedule Your Institutional Demo</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Fill out the form below and our team will get in touch with you right away.
          </p>
        </div>

        {success ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Demo Request Received Successfully!</h3>
            <p className="text-xs text-slate-300">
              We will reach out to your registered email or phone number shortly.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setSuccess(false)}
                className="rounded-xl bg-[#e8d0a9] px-6 py-2.5 text-xs font-bold text-black hover:bg-white transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-xs text-red-400 bg-red-950/40 p-3 rounded-xl border border-red-900/50">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Name / Designation *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Dr. Rajesh Sharma (Principal)" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-[#1f173d] pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-[#e8d0a9]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">School / Institution Name *</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Delhi Public International School" 
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-[#1f173d] pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-[#e8d0a9]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Official Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="email" 
                    required 
                    placeholder="principal@school.edu" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-[#1f173d] pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-[#e8d0a9]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Phone Number / WhatsApp *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="tel" 
                    required 
                    placeholder="+91 98765 43210" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-[#1f173d] pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-[#e8d0a9]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Approximate Student Strength</label>
              <div className="relative">
                <Users className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <select
                  value={formData.studentCount}
                  onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-[#1f173d] pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-[#e8d0a9]"
                >
                  <option>Under 1,000 students</option>
                  <option>1,000 - 3,000 students</option>
                  <option>3,000 - 5,000 students</option>
                  <option>5,000+ students (Multi-Campus)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Specific Requirements or Legacy ERP to Replace</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <textarea 
                  rows={3}
                  placeholder="e.g. Interested in AI attendance, automated fee reminders, and LMS integration."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-[#1f173d] pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-[#e8d0a9] resize-none"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full rounded-2xl bg-[#e8d0a9] py-4 text-xs font-bold text-black hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-xl"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Submitting Demo Request..." : "Request Institutional Demo"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
