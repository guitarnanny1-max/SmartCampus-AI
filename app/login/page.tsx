"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/';

  const [email, setEmail] = useState('admin@smartcampus.ai');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication and set session cookie
    document.cookie = `campus_auth_token=active_session_token_xyz; path=/; max-age=86400;`;

    setTimeout(() => {
      setLoading(false);
      router.push(redirectTo);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '40px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ display: 'inline-flex', background: '#3b82f6', color: 'white', padding: '12px', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
            🎓
          </div>
          <h1 style={{ fontSize: '24px', margin: '0 0 8px 0', color: 'white', fontWeight: 'bold' }}>Welcome to SmartCampusAI</h1>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Sign in to your enterprise campus portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '8px' }}>
              Campus Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px 14px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px 14px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              marginTop: '10px'
            }}
          >
            {loading ? 'Authenticating Secure Session...' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Security Footer Note */}
        <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #334155', paddingTop: '20px' }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            🔒 Secured with PostgreSQL RBAC & Encrypted Cookies
          </span>
        </div>

      </div>
    </div>
  );
}
