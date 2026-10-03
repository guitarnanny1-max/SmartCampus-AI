"use client";

import { useEffect } from "react";

interface TenantSplashProps {
  campusName: string;
  campusLogo?: string | null;
  onComplete: () => void;
}

export default function TenantSplash({
  campusName,
  campusLogo,
  onComplete,
}: TenantSplashProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onComplete();
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <main className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-white">
      <div className="flex w-full max-w-xl flex-col items-center px-6 text-center">
        {campusLogo ? (
          <img
            src={campusLogo}
            alt={`${campusName} logo`}
            className="mb-6 h-24 w-24 rounded-2xl object-contain"
          />
        ) : (
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-bold text-slate-500">
            {campusName.charAt(0).toUpperCase()}
          </div>
        )}

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {campusName}
        </h1>

        <p className="mt-3 text-lg font-medium text-slate-700">
          Welcome to SmartCampusAI
        </p>

        <p className="mt-6 text-sm text-slate-500">
          www.smartcampusai.in
        </p>

        <p className="mt-2 text-xs font-medium text-slate-400">
          Powered by ThomasG Technologies
        </p>
      </div>
    </main>
  );
}
