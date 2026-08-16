import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0f0b1e] px-6 py-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#e8d0a9] text-black font-black flex items-center justify-center text-xs shadow-md">
              SC
            </div>
            <span className="text-sm font-black tracking-wider text-white">SmartCampusAI</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            The Intelligent 360° Campus Operating System. Unifying admissions, academics, administration, finance and engagement in one AI-powered platform.
          </p>
        </div>

        <div className="space-y-3">
          <p className="font-bold text-white uppercase tracking-wider text-[11px]">Platform</p>
          <ul className="space-y-2 text-xs">
            <li><Link href="/features" className="hover:text-[#e8d0a9] transition-colors">Admissions</Link></li>
            <li><Link href="/features" className="hover:text-[#e8d0a9] transition-colors">Academics</Link></li>
            <li><Link href="/features" className="hover:text-[#e8d0a9] transition-colors">Student Information</Link></li>
            <li><Link href="/features" className="hover:text-[#e8d0a9] transition-colors">Fee & Finance</Link></li>
            <li><Link href="/features" className="hover:text-[#e8d0a9] transition-colors">HR & Payroll</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-bold text-white uppercase tracking-wider text-[11px]">Company</p>
          <ul className="space-y-2 text-xs">
            <li><Link href="/about" className="hover:text-[#e8d0a9] transition-colors">About Us</Link></li>
            <li><Link href="/about" className="hover:text-[#e8d0a9] transition-colors">Careers</Link></li>
            <li><Link href="/about" className="hover:text-[#e8d0a9] transition-colors">Press & Media</Link></li>
            <li><Link href="/contact" className="hover:text-[#e8d0a9] transition-colors">Contact Support</Link></li>
            <li><Link href="/about" className="hover:text-[#e8d0a9] transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-bold text-white uppercase tracking-wider text-[11px]">Get in Touch</p>
          <ul className="space-y-2 text-xs">
            <li className="text-white">info.smartcampusai@gmail.com</li>
            <li className="text-white">+91-9959-679467</li>
            <li className="text-slate-400">AP India</li>
            <li className="pt-2">
              <Link href="/admin/login" className="hover:text-[#e8d0a9] transition-colors underline">
                Campus Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
        <p>© 2026 SmartCampusAI. All rights reserved.</p>
        <p>Powered by ThomasG Technologies</p>
      </div>
    </footer>
  );
}
