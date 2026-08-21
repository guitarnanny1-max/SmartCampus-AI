import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In to Smart Campus AI</h2>
        <Suspense fallback={<div className="text-center py-4 text-gray-400">Loading login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
