export default function PricingPage() {
  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full font-semibold border border-emerald-500/20">
            SaaS Monetization
          </span>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">Pricing & Subscription Tiers</h1>
          <p className="text-slate-400 text-sm mt-1">Multi-tenant institutional licensing plans and INR billing structures.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 font-semibold rounded-lg uppercase">Trial Plan</span>
            <h3 className="text-2xl font-bold mt-4">14-Day Free Trial</h3>
            <p className="text-3xl font-black mt-2 text-emerald-400">₹0 <span className="text-xs text-slate-400 font-normal">/ trial</span></p>
            <p className="text-xs text-slate-400 mt-3">Full platform access for evaluation and pilot testing.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400">Instant Automated Provisioning</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-blue-500/40 p-6 rounded-2xl shadow-lg flex flex-col justify-between relative">
          <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Popular</div>
          <div>
            <span className="text-xs px-2.5 py-1 bg-purple-500/10 text-purple-400 font-semibold rounded-lg border border-purple-500/20 uppercase">Pro Tier</span>
            <h3 className="text-2xl font-bold mt-4">Growth Campus</h3>
            <p className="text-3xl font-black mt-2 text-purple-400">₹39,999 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
            <p className="text-xs text-slate-400 mt-3">Ideal for mid-sized institutions with advanced CRM and exams.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400">Priority Support & Custom Subdomain</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 font-semibold rounded-lg border border-blue-500/20 uppercase">Enterprise Tier</span>
            <h3 className="text-2xl font-bold mt-4">Global Enterprise</h3>
            <p className="text-3xl font-black mt-2 text-blue-400">₹1,19,999 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
            <p className="text-xs text-slate-400 mt-3">Unlimited scalability, dedicated DB isolation, IoT energy grid.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400">24/7 Dedicated Account Manager</span>
          </div>
        </div>
      </div>
    </div>
  );
}
