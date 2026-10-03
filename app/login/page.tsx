"use client";

import { FormEvent, useState } from "react";

type Step = "credentials" | "otp";

export default function PlatformLoginPage() {
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("admin@smartcampusai.test");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/platform-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Unable to send verification code.");
        return;
      }

      setMessage(
        data.message || "Verification code sent to your email.",
      );
      setStep("otp");
    } catch {
      setError("Unable to connect to the authentication service.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/platform-otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Unable to verify OTP.");
        return;
      }

      if (
        data.user?.role !== "SUPER_ADMIN" ||
        data.user?.isPlatformUser !== true
      ) {
        setError(
          "This account is not authorized for the platform Command Center.",
        );
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Unable to connect to the authentication service.");
    } finally {
      setLoading(false);
    }
  }

  function backToCredentials() {
    setStep("credentials");
    setOtp("");
    setError("");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 text-sm font-semibold tracking-widest text-cyan-400 uppercase">
            ThomasG Technologies
          </div>

          <h1 className="text-3xl font-bold">
            Platform Command Center
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {step === "credentials"
              ? "Sign in to manage SmartCampusAI platform operations."
              : "Enter the verification code sent to your email."}
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm text-cyan-300">
            {message}
          </div>
        )}

        {step === "credentials" ? (
          <form onSubmit={requestOtp} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Platform Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending verification code..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                6-Digit Verification Code
              </label>

              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                required
                autoComplete="one-time-code"
                autoFocus
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-center text-2xl tracking-[0.35em] outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Enter Command Center"}
            </button>

            <button
              type="button"
              onClick={backToCredentials}
              disabled={loading}
              className="w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
            >
              Back
            </button>
          </form>
        )}

        <div className="mt-6 border-t border-slate-800 pt-5 text-center text-xs text-slate-500">
          Platform administrators only
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-600">
          Powered by ThomasG Technologies · SmartCampus AI
        </p>
      </section>
    </main>
  );
}
