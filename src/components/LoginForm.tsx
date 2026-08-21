"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleBiometricLogin = async () => {
    if (!window.PublicKeyCredential) {
      setError("Biometrics not supported on this device/browser.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // 1. Get challenge from server
      const challengeRes = await fetch("/api/auth/webauthn/login-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!challengeRes.ok) {
        const d = await challengeRes.json();
        throw new Error(d.error || "Failed to initiate biometric login");
      }
      const options = await challengeRes.json();

      options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));
      if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map((cred: any) => ({
          ...cred,
          id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0)),
        }));
      }

      // 2. Prompt user for biometric credential (Touch ID / Face ID)
      const credential = await navigator.credentials.get({ publicKey: options });
      if (!credential) throw new Error("Biometric authentication cancelled.");
      const credAny = credential as any;

      const credentialResponse = {
        id: credential.id,
        rawId: btoa(String.fromCharCode(...new Uint8Array(credAny.rawId))),
        type: credential.type,
        response: {
          clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credAny.response.clientDataJSON))),
          authenticatorData: btoa(String.fromCharCode(...new Uint8Array(credAny.response.authenticatorData))),
          signature: btoa(String.fromCharCode(...new Uint8Array(credAny.response.signature))),
          userHandle: credAny.response.userHandle ? btoa(String.fromCharCode(...new Uint8Array(credAny.response.userHandle))) : null,
        },
      };

      // 3. Verify credential on server
      const verifyRes = await fetch("/api/auth/webauthn/login-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, credential: credentialResponse }),
      });

      if (verifyRes.ok) {
        router.push(callbackUrl);
      } else {
        const d = await verifyRes.json();
        setError(d.error || "Biometric verification failed");
      }
    } catch (err: any) {
      setError(err.message || "Biometric login failed. Try password login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push(callbackUrl);
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 text-sm text-red-400 bg-red-900/30 border border-red-800 rounded">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@school.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In with Password"}
        </button>
      </form>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>

      <button
        type="button"
        onClick={handleBiometricLogin}
        disabled={loading || !email}
        className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        <span>🔒 Sign In with Face ID / Touch ID</span>
      </button>
    </div>
  );
}
