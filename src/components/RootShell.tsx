'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#0f0b1e] text-white flex flex-col">
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}
