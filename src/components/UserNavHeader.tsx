"use client";
import { useRouter, usePathname } from "next/navigation";

export default function UserNavHeader() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide on login/signup pages
  if (pathname === "/login" || pathname === "/signup") return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      // fallback
    }
    router.push("/login");
  };

  return (
    <div className="bg-gray-950 border-b border-gray-800 px-6 py-3 flex flex-wrap justify-between items-center text-sm text-gray-300 sticky top-0 z-40 shadow-md">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 hover:text-white bg-gray-900 hover:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 transition"
        >
          &larr; Back
        </button>
        <a
          href="/"
          className="hover:text-white bg-gray-900 hover:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 transition"
        >
          🏠 Dashboard
        </a>
      </div>
      <div className="flex items-center gap-4 mt-2 sm:mt-0">
        <span className="text-emerald-400 text-xs font-semibold px-2.5 py-1 bg-emerald-950/60 rounded-full border border-emerald-800">
          🟢 PostgreSQL Connected
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 px-3.5 py-1.5 rounded-lg border border-red-800/50 transition font-medium"
        >
          🚪 Log Out
        </button>
      </div>
    </div>
  );
}
