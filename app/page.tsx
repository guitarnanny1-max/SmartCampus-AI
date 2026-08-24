"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";

export default function LandingPage() {
  const [copilotResponse, setCopilotResponse] = useState<string>(
    "👋 Hello Administrator. Select a prompt below or type a query to test our AI-powered campus assistant."
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePromptClick = (prompt: string) => {
    if (prompt.includes("fee collection")) {
      setCopilotResponse("📊 Q3 Status: Total invoiced ₹4.2Cr. Collected ₹3.85Cr (91.6%). Pending arrears across 142 student accounts have automated WhatsApp reminders scheduled for Monday morning.");
    } else if (prompt.includes("substitute teacher")) {
      setCopilotResponse("👥 Grade 10 Roster: 2 faculty members on approved leave. AI matched and assigned qualified substitute teachers: Dr. Sharma (Physics - Period 3) and Prof. Mehta (Mathematics - Period 5). Timetables synced.");
    } else if (prompt.includes("ISO 27001")) {
      setCopilotResponse("🔒 Security Status: All 45 database clusters operating under active 256-Bit TLS encryption. ISO 27001 continuous audit trail active. Zero unauthorized intrusion attempts recorded.");
    }
  };

  const handleDemoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      institutionName: formData.get("institutionName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      board: formData.get("board"),
      studentVolume: formData.get("studentVolume"),
    };

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert("Error submitting request: " + (data.error || "Please try again."));
      }
    } catch (err) {
      alert("Network error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-b border-blue-500/20 py-2 px-4 text-center text-xs md:text-sm font-medium tracking-wide">
        <span className="text-blue-400 font-semibold">VERIFIED SECURE</span> • THE 360 DEGREES CAMPUS OS • ISO 27001 & SOC 2 TYPE II CERTIFIED
        <a href="#security" className="ml-3 underline hover:text-blue-300">View Compliance →</a>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/30">
            S
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight">SmartCampus <span className="text-blue-500">AI</span></span>
            <span className="block text-[10px] text-slate-400 font-mono">www.smartcampusai.in</span>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#copilot" className="hover:text-blue-400 transition">AI Copilot</a>
          <a href="#modules" className="hover:text-blue-400 transition">Enterprise Suite</a>
          <a href="#security" className="hover:text-blue-400 transition">Security & Compliance</a>
          <a href="#pricing" className="hover:text-blue-400 transition">Pricing</a>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/dashboard" className="hidden sm:inline-block text-sm font-medium text-slate-300 hover:text-white px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-900 transition">
            Sign In
          </a>
          <a href="#demo" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition shadow-lg shadow-blue-600/30">
            Request Demo
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6 text-center max-w-5xl mx-auto">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/0 to-slate-950"></div>
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full text-xs font-semibold tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20">
          ⚡ OFFICIAL PORTAL: WWW.SMARTCAMPUSAI.IN
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
          Intelligence at scale. <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
            Absolute administrative clarity.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Empower your institution with The 360 Degrees Campus OS featuring autonomous AI workflows, military-grade security, and unified ERP management.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#demo" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base transition shadow-xl shadow-blue-600/30">
            Schedule Enterprise Demo
          </a>
          <a href="#copilot" className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl font-bold text-base transition">
            Test AI Copilot Live
          </a>
        </div>
        <p className="mt-3 text-xs font-mono text-slate-500">www.smartcampusai.in/ai-command-center</p>
      </section>

      {/* Stats Ticker */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">500+</div>
            <div className="text-xs md:text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">Enterprise Campuses</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-blue-400">ISO 27001</div>
            <div className="text-xs md:text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">Certified Information Security</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">SOC 2</div>
            <div className="text-xs md:text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">Type II Compliance Audited</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-blue-400">99.9%</div>
            <div className="text-xs md:text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">System Uptime SLA</div>
          </div>
        </div>
      </section>

      {/* AI Copilot Simulator Section */}
      <section id="copilot" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">AI-POWERED CAMPUS INTELLIGENCE</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Experience SmartCampus AI Copilot.</h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
            Test how our enterprise AI instantly resolves administrative inquiries, projects financial health, and orchestrates daily campus workflows.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black">
                SCAI
              </div>
              <div>
                <h3 className="font-bold text-sm">SmartCampus Administrative Copilot</h3>
                <span className="text-xs text-emerald-400 font-mono">● Online • Connected to www.smartcampusai.in Database</span>
              </div>
            </div>
            <span className="text-xs px-3 py-1 bg-slate-800 text-slate-400 rounded-full font-mono">v4.2 Enterprise</span>
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800/80 mb-6 min-h-[120px] flex items-center">
            <p className="text-slate-300 font-medium text-sm md:text-base leading-relaxed">{copilotResponse}</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select a test prompt below:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button onClick={() => handlePromptClick("Summarize Q3 fee collection status")} className="p-3 text-left text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-slate-300 cursor-pointer">
                📊 "Summarize Q3 fee collection status"
              </button>
              <button onClick={() => handlePromptClick("Generate substitute teacher roster for Grade 10")} className="p-3 text-left text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-slate-300 cursor-pointer">
                👥 "Generate substitute teacher roster for Grade 10"
              </button>
              <button onClick={() => handlePromptClick("Verify ISO 27001 data encryption status")} className="p-3 text-left text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-slate-300 cursor-pointer">
                🔒 "Verify ISO 27001 data encryption status"
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section id="security" className="py-24 px-6 bg-slate-900/30 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">ENTERPRISE GRADE SECURITY</div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Uncompromising data protection.</h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
              Built from the ground up to meet the stringent security mandates of elite schools, universities, and government boards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="font-bold text-lg mb-2">ISO 27001 Certified</h3>
              <p className="text-sm text-slate-400">International benchmark for information security management systems (ISMS).</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="font-bold text-lg mb-2">SOC 2 Type II Audited</h3>
              <p className="text-sm text-slate-400">Verified operational controls protecting confidentiality, availability, and privacy.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-bold text-lg mb-2">256-Bit TLS Encryption</h3>
              <p className="text-sm text-slate-400">Bank-grade data encryption in transit and at rest across all endpoints.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="text-3xl mb-4">📜</div>
              <h3 className="font-bold text-lg mb-2">FERPA & GDPR Compliant</h3>
              <p className="text-sm text-slate-400">Strict adherence to student record confidentiality laws worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modular Campus OS */}
      <section id="modules" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">MODULAR CAMPUS OS</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Unified enterprise modules.</h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
            Every administrative department seamlessly connected under one intelligent AI roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "AI Admissions & CRM", desc: "Automate lead nurturing, entrance scheduling, and secure applicant pipelines." },
            { title: "Smart Academics & Timetables", desc: "AI-generated conflict-free schedules, curriculum mapping, and gradebooks." },
            { title: "Fee Ledger & SmartPay", desc: "Automated fee reminders, online gateway synchronization, and vendor payouts." },
            { title: "HR, Payroll & Biometrics", desc: "Biometric attendance matching, tax deductions, and automated salary disbursement." },
            { title: "Transport & Live GPS", desc: "Optimized bus routes and real-time tracking for parents and administrators." },
            { title: "Autonomous AI Copilot", desc: "24/7 institutional assistant answering queries and forecasting P&L trends." },
          ].map((mod, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition">
              <h3 className="font-bold text-lg mb-2 text-white">{mod.title}</h3>
              <p className="text-sm text-slate-400">{mod.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-slate-900/30 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">TRANSPARENT PRICING</div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Configured for your institution size.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl mb-1">Foundation</h3>
                <p className="text-sm text-slate-400 mb-6">For Small Schools (Up to 500 Students)</p>
                <div className="text-3xl font-extrabold mb-6">₹3,000 – ₹4,500 <span className="text-sm font-normal text-slate-400">/ month</span></div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li>✓ Admissions & Core ERP</li>
                  <li>✓ Student 360 Profiles</li>
                  <li>✓ Parent Communication Portal</li>
                </ul>
              </div>
              <a href="#demo" className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-center transition">Get Started</a>
            </div>

            <div className="bg-gradient-to-b from-blue-900/40 to-slate-900 border-2 border-blue-500 rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                Enterprise Popular
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Growth Plan</h3>
                <p className="text-sm text-slate-400 mb-6">For Mid-Sized Institutions (500 – 2,000 Students)</p>
                <div className="text-3xl font-extrabold mb-6">₹10,000 – ₹15,000 <span className="text-sm font-normal text-slate-400">/ month</span></div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li>✓ Everything in Foundation</li>
                  <li>✓ HR, Payroll & Transport GPS</li>
                  <li>✓ Advanced Fee Collection & Ledger</li>
                </ul>
              </div>
              <a href="#demo" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-center transition shadow-lg shadow-blue-600/30">Choose Growth</a>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl mb-1">Enterprise AI</h3>
                <p className="text-sm text-slate-400 mb-6">For Colleges & Universities (2,000+ Students)</p>
                <div className="text-2xl font-extrabold mb-6">Custom <span className="text-sm font-normal text-slate-400">(Starting ₹25k+/mo)</span></div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li>✓ Full AI Copilot Suite</li>
                  <li>✓ ISO 27001 & SOC 2 Audit Logs</li>
                  <li>✓ Custom ERP API Integrations</li>
                </ul>
              </div>
              <a href="#demo" className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-center transition">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* Request Demo Form Section */}
      <section id="demo" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Deploy The 360 Degrees Campus OS</h2>
            <p className="text-slate-400">Schedule your personalized walkthrough via www.smartcampusai.in with our security and engineering team.</p>
          </div>

          {submitted ? (
            <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-3">
              <div className="text-3xl">🎉</div>
              <h3 className="text-xl font-bold text-emerald-400">Demo Request Received Successfully!</h3>
              <p className="text-sm text-slate-300">Our enterprise onboarding engineer will contact your institution shortly to provision your dedicated instance on www.smartcampusai.in.</p>
              <button 
                onClick={() => setSubmitted(false)} 
                className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg transition"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleDemoSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Your Name</label>
                  <input required name="name" type="text" placeholder="Dr. R. Sharma" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Institution Name</label>
                  <input required name="institutionName" type="text" placeholder="Delhi Public School" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Mobile Number</label>
                  <input required name="phone" type="tel" placeholder="+91 98211 44321" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Official Email</label>
                  <input required name="email" type="email" placeholder="principal@dps.edu.in" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Curriculum Board</label>
                  <select name="board" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-white">
                    <option>CBSE Board School</option>
                    <option>ICSE / ISC Board</option>
                    <option>IB World School</option>
                    <option>State Board Institution</option>
                    <option>Private University / College</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Student Volume</label>
                  <select name="studentVolume" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-white">
                    <option>Under 500 Students</option>
                    <option>500 – 1,500 Students</option>
                    <option>1,500 – 3,000 Students</option>
                    <option>3,000+ Students (University)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-xl shadow-blue-600/30 text-base cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Processing Request..." : "Schedule Priority Demo"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-400">SmartCampus AI</p>
        <p className="text-slate-400 font-medium">Powered by <span className="text-blue-400 font-bold">thomasG technologies</span></p>
        <p className="text-slate-500">ISO 27001 & SOC 2 Type II Certified • www.smartcampusai.in • The 360 Degrees Campus OS. © 2026</p>
      </footer>
    </div>
  );
}
