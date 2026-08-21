import { Suspense } from "react";
import SignupForm from "@/components/SignupForm";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        <Suspense fallback={<div className="text-center py-4 text-gray-400">Loading signup...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
