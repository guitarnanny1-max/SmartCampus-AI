'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalLayout({ 
  children, 
  navbar, 
  footer 
}: { 
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#0f0b1e] text-white flex flex-col">
      {!isAdmin && navbar}
      <main className="flex-1">
        {children}
      </main>
      {!isAdmin && footer}
    </div>
  );
}
