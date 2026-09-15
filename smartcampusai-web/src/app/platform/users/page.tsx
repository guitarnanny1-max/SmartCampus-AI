"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MailPlus, ShieldCheck, Users } from "lucide-react";

type PlatformUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  platformRole: string | null;
  isPlatformUser: boolean;
  createdAt: string;
};

export default function PlatformUsersPage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch("/api/platform/users", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load platform users");
        }

        setUsers(data.users ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load platform users",
        );
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/platform"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Platform Control Center
        </Link>

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-xl bg-slate-900 p-2 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Platform Administration
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Platform Users
            </h1>
            <p className="mt-2 text-slate-600">
              Manage users who have access to the SmartCampusAI platform control
              center.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Users className="h-5 w-5 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              {loading ? "…" : users.length} platform user
              {users.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {inviteMessage ? (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-700">
            {inviteMessage}
          </div>
        ) : null}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-2 text-violet-700">
              <MailPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Invite Platform User
              </h2>
              <p className="text-sm text-slate-500">
                Send a secure Supabase Auth invitation to a new platform administrator.
              </p>
            </div>
          </div>

          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setInviteLoading(true);
              setInviteMessage("");
              setError("");

              try {
                const response = await fetch("/api/platform/users/invite", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ name, email }),
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(
                    data.error || "Unable to send invitation.",
                  );
                }

                setInviteMessage(
                  data.message || "Platform user invitation sent successfully.",
                );
                setName("");
                setEmail("");

                const refresh = await fetch("/api/platform/users", {
                  cache: "no-store",
                });
                const refreshedData = await refresh.json();

                if (refresh.ok) {
                  setUsers(refreshedData.users ?? []);
                }
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "Unable to send invitation.",
                );
              } finally {
                setInviteLoading(false);
              }
            }}
            className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <label
                htmlFor="platform-user-name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full name
              </label>
              <input
                id="platform-user-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jane Smith"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                required
              />
            </div>

            <div>
              <label
                htmlFor="platform-user-email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <input
                id="platform-user-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jane@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={inviteLoading}
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {inviteLoading ? "Sending…" : "Send Invitation"}
              </button>
            </div>
          </form>
        </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Authorized Platform Users
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Only users marked as platform users are shown here.
              </p>
            </div>

            {loading ? (
              <div className="px-6 py-12 text-center text-sm text-slate-500">
                Loading platform users…
              </div>
            ) : users.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-slate-500">
                No platform users found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">
                        Platform Role
                      </th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Created</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">
                            {user.name}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            {user.email}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {user.role}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {user.platformRole ?? "—"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Active
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
      </div>
    </main>
  );
}
