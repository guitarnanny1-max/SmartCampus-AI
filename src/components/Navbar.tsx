import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-[#0f0b1e]/90 backdrop-blur-md px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-[#e8d0a9] text-black font-black flex items-center justify-center text-xs shadow-md">
          SC
        </div>
        <div>
          <span className="text-sm font-black tracking-wider text-white">SmartCampusAI</span>
        </div>
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
        <Link href="/features" className="hover:text-[#e8d0a9] transition-colors">Features</Link>
        <Link href="/solutions" className="hover:text-[#e8d0a9] transition-colors">Solutions</Link>
        <Link href="/resources" className="hover:text-[#e8d0a9] transition-colors">Resources</Link>
        <Link href="/pricing" className="hover:text-[#e8d0a9] transition-colors">Pricing</Link>
      </nav>
      <div className="flex items-center gap-3">
        <Link 
          href="/admin/login" 
          className="px-4 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
        >
          Campus Login
        </Link>
        <Link 
          href="/#demo" 
          className="px-4 py-2 text-xs font-bold rounded-xl bg-[#e8d0a9] text-black hover:bg-[#d8c099] transition-colors shadow-lg"
        >
          Request Demo
        </Link>
      </div>
    </header>
  );
}
