"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Main Dashboard', href: '/', icon: '📊' },
    { name: 'Admissions CRM', href: '/admissions', icon: '📋' },
    { name: 'Student Management', href: '/students', icon: '👨‍🎓' },
    { name: 'Staff & HR', href: '/staff', icon: '👔' },
    { name: 'Examinations', href: '/exams', icon: '📝' },
    { name: 'Library & Assets', href: '/library', icon: '📚' },
    { name: 'Energy & Power', href: '/energy', icon: '⚡' },
    { name: 'Transport & Fleet', href: '/transport', icon: '🚌' },
    { name: 'Fee & Finance', href: '/finance', icon: '💳' },
    { name: 'Pricing & Tiers', href: '/pricing', icon: '🏷️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ width: '260px', background: '#1e293b', borderRight: '1px solid #334155', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Logo / Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '35px', paddingLeft: '8px' }}>
            <span style={{ background: '#3b82f6', color: 'white', padding: '8px', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold' }}>🎓</span>
            <div>
              <h2 style={{ fontSize: '16px', margin: 0, color: 'white', fontWeight: 'bold' }}>SmartCampusAI</h2>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Enterprise Campus ERP</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? 'white' : '#94a3b8',
                    background: isActive ? '#3b82f6' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  <span>{item.name}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Footer Profile / Status */}
        <div style={{ background: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'white', marginBottom: '2px' }}>Campus Admin</div>
          <div style={{ fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }}></span>
            PostgreSQL DB Connected
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>

    </div>
  );
}
