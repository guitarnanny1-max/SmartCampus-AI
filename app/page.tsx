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
      setCopilotResponse("📊 Q3 Status: Illustrative example only: a school administrator could review fee collection totals and outstanding balances using verified school data, where those features are configured.");
    } else if (prompt.includes("substitute teacher")) {
      setCopilotResponse("👥 Grade 10 Roster: 2 faculty members on approved leave. Illustrative example only: staff availability and substitute suggestions would need to be verified by an authorized school administrator. No assignments or timetable changes are made by this preview.");
    } else if (prompt.includes("security-first design")) {
      setCopilotResponse("🔒 Security Status: This preview does not access live infrastructure or verify encryption, audits, or intrusion activity.");
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
        <span className="text-blue-400 font-semibold">SECURITY-FIRST DESIGN</span> • THE 360 DEGREES CAMPUS OS • MODERN SECURITY ARCHITECTURE
        <a href="#security" className="ml-3 underline hover:text-blue-300">View Security Approach →</a>
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
          <a href="/login" className="hidden sm:inline-block text-sm font-medium text-slate-300 hover:text-white px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-900 transition">
            Sign In
          </a>
          <a href="#demo" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition shadow-lg shadow-blue-600/30">
            Request Demo
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="scai-hero relative isolate overflow-hidden min-h-[650px] md:min-h-[740px] flex items-center"
        aria-labelledby="hero-heading"
      >
        {/* Background image */}
        <div
          className="scai-hero-wallpaper absolute inset-0 -z-30"
          style={{
            backgroundImage: "url('/images/smartcampus-hero.png')",
            backgroundSize: "cover",
            backgroundPosition: "center 35%",
          }}
          aria-hidden="true"
        />

        {/* Dark overlays for text contrast */}
        <div
          className="absolute inset-0 -z-20 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/25"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-20 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/35"
          aria-hidden="true"
        />

        {/* Animated blue and cyan atmosphere */}
        <div className="scai-glow scai-glow-blue" aria-hidden="true" />
        <div className="scai-glow scai-glow-cyan" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-4xl text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full text-xs md:text-sm font-semibold tracking-wide bg-blue-950/60 text-cyan-200 border border-cyan-400/30 backdrop-blur-md shadow-lg shadow-blue-950/30">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
              </span>
              SECURITY-FIRST DESIGN
              <span className="text-cyan-500">•</span>
              THE 360 DEGREES CAMPUS OS
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.08] mb-7 text-white"
            >
              Intelligence at scale.
              <br />
              <span className="scai-hero-gradient">
                Absolute administrative clarity.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-200/90 max-w-2xl mb-10 leading-relaxed">
              Empower your institution with The 360 Degrees Campus OS,
              featuring AI-assisted administrative workflows, modern
              security architecture, and unified ERP management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base transition-all duration-300 shadow-xl shadow-blue-600/30 hover:shadow-cyan-500/30 hover:-translate-y-1"
              >
                Schedule Enterprise Demo
                <span aria-hidden="true">→</span>
              </a>

              <a
                href="#copilot"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-950/60 hover:bg-slate-900/80 text-white border border-cyan-400/30 hover:border-cyan-300/60 rounded-xl font-bold text-base backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
              >
                <span aria-hidden="true">✦</span>
                Test AI Copilot Live
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                Unified campus management
              </span>
              <span className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                AI-assisted workflows
              </span>
              <span className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                Privacy-aware design
              </span>
            </div>
          </div>
        </div>

        <style jsx>{`
          .scai-hero-wallpaper {
            animation: scai-wallpaper-drift 28s ease-in-out infinite alternate;
            transform-origin: center;
            will-change: transform;
          }

          .scai-glow {
            position: absolute;
            z-index: -10;
            width: 32rem;
            height: 32rem;
            border-radius: 9999px;
            filter: blur(100px);
            pointer-events: none;
            opacity: 0.22;
            animation: scai-glow-float 12s ease-in-out infinite alternate;
          }

          .scai-glow-blue {
            top: 5%;
            left: -12rem;
            background: #2563eb;
          }

          .scai-glow-cyan {
            right: -12rem;
            bottom: -10%;
            background: #06b6d4;
            animation-delay: -6s;
          }

          .scai-hero-gradient {
            background: linear-gradient(
              100deg,
              #60a5fa 0%,
              #67e8f9 45%,
              #ffffff 90%
            );
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
          }

          @keyframes scai-wallpaper-drift {
            from {
              transform: scale(1);
            }
            to {
              transform: scale(1.07);
            }
          }

          @keyframes scai-glow-float {
            from {
              transform: translate3d(0, -20px, 0) scale(0.9);
            }
            to {
              transform: translate3d(30px, 30px, 0) scale(1.15);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .scai-hero-wallpaper,
            .scai-glow {
              animation: none !important;
            }
          }
        `}</style>
      </section>

      {/* Stats Ticker */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">Campus Management</div>
            <div className="text-xs md:text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">Unified School Operations</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-blue-400">Security-First Design</div>
            <div className="text-xs md:text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">Modern Security Architecture</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">Privacy-Focused</div>
            <div className="text-xs md:text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">Designed with Privacy in Mind</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-blue-400">Modern</div>
            <div className="text-xs md:text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">Technology Platform</div>
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
                <span className="text-xs text-emerald-400 font-mono">● Interactive Demo • Illustrative Sample Data</span>
              </div>
            </div>
            <span className="text-xs px-3 py-1 bg-slate-800 text-slate-400 rounded-full font-mono">Interactive Preview</span>
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
              <button onClick={() => handlePromptClick("Explain the security-first design")} className="p-3 text-left text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-slate-300 cursor-pointer">
                🔒 "Explain the security-first design"
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
              <h3 className="font-bold text-lg mb-2">Security-First Design</h3>
              <p className="text-sm text-slate-400">We are developing our security practices as the platform evolves.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="font-bold text-lg mb-2">Privacy-Aware Design</h3>
              <p className="text-sm text-slate-400">Security and privacy practices should be reviewed and verified before adoption.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-bold text-lg mb-2">Data Protection</h3>
              <p className="text-sm text-slate-400">Review the platform's security and data-handling practices before adopting it.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="text-3xl mb-4">📜</div>
              <h3 className="font-bold text-lg mb-2">Privacy-Aware Design</h3>
              <p className="text-sm text-slate-400">Institutions should assess applicable privacy and data protection requirements before adopting the platform.</p>
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
            { title: "AI-Assisted Campus Tools", desc: "Illustrative AI-assisted support for administrative queries and workflows, subject to feature availability." },
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
                  <li>✓ AI-assisted features (where available)</li>
                  <li>✓ Security and access-control features (subject to configuration)</li>
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
        <p className="text-slate-500">Security-First Design • Privacy-Aware Design • www.smartcampusai.in • The 360 Degrees Campus OS. © 2026</p>
      </footer>
    </div>
  );
}