"use client";

import { FormEvent, useMemo, useState } from "react";

export type CrmLead = {
  id: string;
  campus_name: string;
  contact_name: string | null;
  contact_role: string | null;
  email: string | null;
  mobile: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  emailSource: string | null;
  phoneSource: string | null;
  whatsappSource: string | null;
  whatsappNumber: string | null;
  emailAllowed: boolean;
  whatsappAllowed: boolean;
  voiceAllowed: boolean;
  optedOut: boolean;
};

type ExtractedData = {
  title: string | null;
  emails: string[];
  phones: string[];
  whatsappNumbers: string[];
  textPreview: string;
};

type Props = {
  initialLeads: CrmLead[];
};

export default function LeadWorkspace({ initialLeads }: Props) {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const [campusName, setCampusName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [website, setWebsite] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const [emailAllowed, setEmailAllowed] = useState(false);
  const [whatsappAllowed, setWhatsappAllowed] = useState(false);
  const [voiceAllowed, setVoiceAllowed] = useState(false);

  const [extracted, setExtracted] = useState<ExtractedData | null>(null);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return leads;

    return leads.filter((lead) =>
      [
        lead.campus_name,
        lead.contact_name,
        lead.contact_role,
        lead.email,
        lead.mobile,
        lead.city,
        lead.state,
        lead.website,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(q)
        )
    );
  }, [leads, search]);

  async function extractWebsite() {
    if (!website.trim()) {
      setError("Enter a website URL first.");
      return;
    }

    setExtracting(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        "/api/platform-crm/extract-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            website: website.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Website extraction failed."
        );
      }

      const result: ExtractedData = data.extracted;

      setExtracted(result);

      if (!campusName && result.title) {
        setCampusName(result.title);
      }

      if (!email && result.emails[0]) {
        setEmail(result.emails[0]);
      }

      if (!mobile && result.phones[0]) {
        setMobile(result.phones[0]);
      }

      setNotice(
        "Website information extracted successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Website extraction failed."
      );
    } finally {
      setExtracting(false);
    }
  }

  async function saveLead(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!campusName.trim()) {
      setError("Campus / school name is required.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        "/api/platform-crm/leads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            campus_name: campusName.trim(),
            contact_name: contactName.trim(),
            contact_role: contactRole.trim(),
            email: email.trim(),
            mobile: mobile.trim(),
            whatsappNumber:
              whatsappNumber.trim() ||
              extracted?.whatsappNumbers[0] ||
              "",
            city: city.trim(),
            state: state.trim(),
            website: website.trim(),
            websiteExtractedAt: extracted
              ? new Date().toISOString()
              : undefined,
            emailSource: extracted?.emails.length
              ? website.trim()
              : undefined,
            phoneSource: extracted?.phones.length
              ? website.trim()
              : undefined,
            whatsappSource: extracted?.whatsappNumbers.length
              ? website.trim()
              : undefined,
            emailAllowed,
            whatsappAllowed,
            voiceAllowed,
            source: "MANUAL",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to create CRM lead."
        );
      }

      setLeads((current) => [
        data.lead as CrmLead,
        ...current,
      ]);

      setCampusName("");
      setContactName("");
      setContactRole("");
      setEmail("");
      setMobile("");
      setCity("");
      setState("");
      setWebsite("");
      setWhatsappNumber("");
      setEmailAllowed(false);
      setWhatsappAllowed(false);
      setVoiceAllowed(false);
      setExtracted(null);

      setNotice("CRM lead created successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create CRM lead."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="border-b border-slate-800 pb-6">
          <div className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            thomasG technologies • CRM
          </div>

          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                CRM Lead Workspace
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Capture, enrich and manage school prospects.
              </p>
            </div>

            <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300">
              {leads.length} CRM leads
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {notice && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            {notice}
          </div>
        )}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <h2 className="text-lg font-bold">
            Add / Enrich Lead
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Enter a school website to extract contact information.
          </p>

          <form
            onSubmit={saveLead}
            className="mt-6 space-y-6"
          >
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Website URL
              </label>

              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  value={website}
                  onChange={(event) =>
                    setWebsite(event.target.value)
                  }
                  placeholder="https://school-example.com"
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                />

                <button
                  type="button"
                  onClick={extractWebsite}
                  disabled={extracting}
                  className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300 disabled:opacity-50"
                >
                  {extracting
                    ? "Extracting..."
                    : "Extract Website"}
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={campusName}
                onChange={(event) =>
                  setCampusName(event.target.value)
                }
                placeholder="Campus / School Name *"
                required
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />

              <input
                value={contactName}
                onChange={(event) =>
                  setContactName(event.target.value)
                }
                placeholder="Contact Name"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />

              <input
                value={contactRole}
                onChange={(event) =>
                  setContactRole(event.target.value)
                }
                placeholder="Principal / Correspondent / Director"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Email"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />

              <input
                value={mobile}
                onChange={(event) =>
                  setMobile(event.target.value)
                }
                placeholder="Phone"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />

              <input
                value={whatsappNumber}
                onChange={(event) =>
                  setWhatsappNumber(event.target.value)
                }
                placeholder="WhatsApp Number"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />

              <input
                value={city}
                onChange={(event) =>
                  setCity(event.target.value)
                }
                placeholder="City"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />

              <input
                value={state}
                onChange={(event) =>
                  setState(event.target.value)
                }
                placeholder="State"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
              />
            </div>

            {extracted && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <h3 className="font-semibold">
                  Extracted Website Data
                </h3>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <div className="text-xs text-slate-500">
                      Emails
                    </div>
                    <div className="mt-1 text-sm text-slate-200">
                      {extracted.emails.length
                        ? extracted.emails.join(", ")
                        : "None found"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500">
                      Phones
                    </div>
                    <div className="mt-1 text-sm text-slate-200">
                      {extracted.phones.length
                        ? extracted.phones.join(", ")
                        : "None found"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500">
                      WhatsApp
                    </div>
                    <div className="mt-1 text-sm text-slate-200">
                      {extracted.whatsappNumbers.length
                        ? extracted.whatsappNumbers.join(", ")
                        : "None found"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm">
                <input
                  type="checkbox"
                  checked={emailAllowed}
                  onChange={(event) =>
                    setEmailAllowed(event.target.checked)
                  }
                />
                Email allowed
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm">
                <input
                  type="checkbox"
                  checked={whatsappAllowed}
                  onChange={(event) =>
                    setWhatsappAllowed(
                      event.target.checked
                    )
                  }
                />
                WhatsApp allowed
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm">
                <input
                  type="checkbox"
                  checked={voiceAllowed}
                  onChange={(event) =>
                    setVoiceAllowed(event.target.checked)
                  }
                />
                Voice allowed
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
            >
              {loading
                ? "Saving Lead..."
                : "Save CRM Lead"}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold">
                CRM Leads
              </h2>
              <p className="text-xs text-slate-500">
                Search your prospect database.
              </p>
            </div>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search school, contact, email, phone..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-500 md:w-96"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full min-w-[1250px] text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4">School</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Mobile</th>
                  <th className="px-5 py-4">WhatsApp</th>
                  <th className="px-5 py-4">Consent</th>
                  <th className="px-5 py-4">Manage</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-950/60"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold">
                        {lead.campus_name}
                      </div>

                      {lead.website && (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block max-w-xs truncate text-xs text-cyan-400 hover:underline"
                        >
                          {lead.website}
                        </a>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {lead.contact_name || "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-400">
                      {lead.contact_role || "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-400">
                      {[lead.city, lead.state]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>

                    <td className="px-5 py-4">
                      {lead.email || "—"}
                    </td>

                    <td className="px-5 py-4">
                      {lead.mobile || "—"}
                    </td>

                    <td className="px-5 py-4">
                      {lead.whatsappNumber ? (
                        <div>
                          <div className="text-cyan-300">
                            {lead.whatsappNumber}
                          </div>
                          {lead.whatsappSource && (
                            <div className="mt-1 text-[10px] text-slate-600">
                              Extracted
                            </div>
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex max-w-[160px] flex-wrap gap-1">
                        {lead.emailAllowed && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300">
                            Email
                          </span>
                        )}

                        {lead.whatsappAllowed && (
                          <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-300">
                            WhatsApp
                          </span>
                        )}

                        {lead.voiceAllowed && (
                          <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] text-violet-300">
                            Voice
                          </span>
                        )}

                        {lead.optedOut && (
                          <span className="rounded-full bg-red-500/10 px-2 py-1 text-[10px] text-red-300">
                            Opted Out
                          </span>
                        )}

                        {!lead.emailAllowed &&
                          !lead.whatsappAllowed &&
                          !lead.voiceAllowed &&
                          !lead.optedOut && (
                            <span className="text-xs text-slate-600">
                              No consent
                            </span>
                          )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <a
                        href={`/admin/leads/manage?id=${encodeURIComponent(lead.id)}`}
                        className="inline-flex items-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
                      >
                        Manage
                      </a>
                    </td>
                  </tr>
                ))}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No CRM leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
