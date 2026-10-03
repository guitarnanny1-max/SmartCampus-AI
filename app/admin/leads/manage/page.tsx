"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import LeadCommunicationTimeline from "@/components/platform-crm/LeadCommunicationTimeline";
import WhatsAppConversation from "@/components/platform-crm/WhatsAppConversation";

type Lead = {
  id: string;
  campus_name: string;
  contact_name: string | null;
  contact_role: string | null;
  email: string | null;
  mobile: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  whatsappNumber: string | null;
  emailAllowed: boolean;
  whatsappAllowed: boolean;
  voiceAllowed: boolean;
  optedOut: boolean;
};

export default function LeadManagementPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [campusName, setCampusName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [website, setWebsite] = useState("");

  const [emailAllowed, setEmailAllowed] = useState(false);
  const [whatsappAllowed, setWhatsappAllowed] = useState(false);
  const [voiceAllowed, setVoiceAllowed] = useState(false);
  const [optedOut, setOptedOut] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadLeads() {
      try {
        const response = await fetch(
          "/api/platform-crm/leads",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Failed to load CRM leads."
          );
        }

        setLeads(data.leads || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load CRM leads."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

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
        lead.whatsappNumber,
        lead.city,
        lead.state,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(q)
        )
    );
  }, [leads, search]);

  function openLead(lead: Lead) {
    setSelectedId(lead.id);
    setCampusName(lead.campus_name || "");
    setContactName(lead.contact_name || "");
    setContactRole(lead.contact_role || "");
    setEmail(lead.email || "");
    setMobile(lead.mobile || "");
    setWhatsappNumber(lead.whatsappNumber || "");
    setCity(lead.city || "");
    setState(lead.state || "");
    setWebsite(lead.website || "");
    setEmailAllowed(lead.emailAllowed);
    setWhatsappAllowed(lead.whatsappAllowed);
    setVoiceAllowed(lead.voiceAllowed);
    setOptedOut(lead.optedOut);
    setMessage("");
    setError("");
  }

  function clearForm() {
    setSelectedId(null);
    setCampusName("");
    setContactName("");
    setContactRole("");
    setEmail("");
    setMobile("");
    setWhatsappNumber("");
    setCity("");
    setState("");
    setWebsite("");
    setEmailAllowed(false);
    setWhatsappAllowed(false);
    setVoiceAllowed(false);
    setOptedOut(false);
    setMessage("");
    setError("");
  }

  async function saveLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedId) {
      setError("Select a lead first.");
      return;
    }

    if (!campusName.trim()) {
      setError("School name is required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/platform-crm/leads/${selectedId}`,
        {
          method: "PATCH",
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
            whatsappNumber: whatsappNumber.trim(),
            city: city.trim(),
            state: state.trim(),
            website: website.trim(),
            emailAllowed,
            whatsappAllowed,
            voiceAllowed,
            optedOut,
            optOutSource: optedOut
              ? "CRM_ADMIN"
              : undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to update lead."
        );
      }

      setLeads((current) =>
        current.map((lead) =>
          lead.id === selectedId
            ? (data.lead as Lead)
            : lead
        )
      );

      setMessage("CRM lead updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update lead."
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedLead =
    leads.find((lead) => lead.id === selectedId) ||
    null;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              thomasG technologies • CRM
            </div>

            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Lead Management
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Edit lead details and manage communication permissions.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/admin/leads"
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
            >
              ← CRM Workspace
            </a>

            <a
              href="/admin/campaigns"
              className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20"
            >
              Campaigns →
            </a>
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            {message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold">CRM Leads</h2>
                <div className="mt-1 text-xs text-slate-500">
                  {leads.length} lead(s)
                </div>
              </div>
            </div>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search leads..."
              className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />

            <div className="mt-4 max-h-[650px] space-y-2 overflow-y-auto">
              {loading ? (
                <div className="py-10 text-center text-sm text-slate-600">
                  Loading leads...
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-600">
                  No matching leads.
                </div>
              ) : (
                filteredLeads.map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => openLead(lead)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selectedId === lead.id
                        ? "border-cyan-500/40 bg-cyan-500/10"
                        : "border-slate-800 bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-semibold text-white">
                      {lead.campus_name}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {lead.contact_name || "No contact"}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {lead.emailAllowed &&
                        lead.email && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300">
                            EMAIL
                          </span>
                        )}

                      {lead.whatsappAllowed &&
                        lead.whatsappNumber && (
                          <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-300">
                            WHATSAPP
                          </span>
                        )}

                      {lead.voiceAllowed &&
                        lead.mobile && (
                          <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] text-violet-300">
                            VOICE
                          </span>
                        )}

                      {lead.optedOut && (
                        <span className="rounded-full bg-red-500/10 px-2 py-1 text-[10px] text-red-300">
                          OPTED OUT
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            {!selectedLead ? (
              <div className="flex min-h-[500px] items-center justify-center text-center">
                <div>
                  <div className="text-lg font-semibold">
                    Select a CRM lead
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    Choose a lead from the left to edit contact details and permissions.
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={saveLead}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      Edit CRM Lead
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {selectedLead.id}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={clearForm}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:bg-slate-800"
                  >
                    Clear
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value={campusName}
                    onChange={(event) =>
                      setCampusName(event.target.value)
                    }
                    placeholder="School name"
                    required
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm"
                  />

                  <input
                    value={contactName}
                    onChange={(event) =>
                      setContactName(event.target.value)
                    }
                    placeholder="Contact name"
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm"
                  />

                  <input
                    value={contactRole}
                    onChange={(event) =>
                      setContactRole(event.target.value)
                    }
                    placeholder="Contact role"
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="Email"
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm"
                  />

                  <input
                    value={mobile}
                    onChange={(event) =>
                      setMobile(event.target.value)
                    }
                    placeholder="Phone"
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm"
                  />

                  <input
                    value={whatsappNumber}
                    onChange={(event) =>
                      setWhatsappNumber(
                        event.target.value
                      )
                    }
                    placeholder="WhatsApp number"
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm"
                  />

                  <input
                    value={city}
                    onChange={(event) =>
                      setCity(event.target.value)
                    }
                    placeholder="City"
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm"
                  />

                  <input
                    value={state}
                    onChange={(event) =>
                      setState(event.target.value)
                    }
                    placeholder="State"
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm"
                  />

                  <input
                    value={website}
                    onChange={(event) =>
                      setWebsite(event.target.value)
                    }
                    placeholder="Website"
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm md:col-span-2"
                  />
                </div>

                <div>
                  <h3 className="mb-3 font-semibold">
                    Communication Permissions
                  </h3>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm">
                      <input
                        type="checkbox"
                        checked={emailAllowed}
                        disabled={optedOut}
                        onChange={(event) =>
                          setEmailAllowed(
                            event.target.checked
                          )
                        }
                      />
                      Email allowed
                    </label>

                    <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm">
                      <input
                        type="checkbox"
                        checked={whatsappAllowed}
                        disabled={optedOut}
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
                        disabled={optedOut}
                        onChange={(event) =>
                          setVoiceAllowed(
                            event.target.checked
                          )
                        }
                      />
                      Voice allowed
                    </label>

                    <label className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
                      <input
                        type="checkbox"
                        checked={optedOut}
                        onChange={(event) => {
                          const checked =
                            event.target.checked;

                          setOptedOut(checked);

                          if (checked) {
                            setEmailAllowed(false);
                            setWhatsappAllowed(false);
                            setVoiceAllowed(false);
                          }
                        }}
                      />
                      Opted out
                    </label>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-xs uppercase tracking-wider text-slate-500">
                    Campaign readiness
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <div>
                      <div className="text-xs text-slate-500">
                        Email
                      </div>
                      <div className="mt-1 text-sm">
                        {email && emailAllowed
                          ? "Eligible"
                          : "Not eligible"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">
                        WhatsApp
                      </div>
                      <div className="mt-1 text-sm">
                        {whatsappNumber &&
                        whatsappAllowed
                          ? "Eligible"
                          : "Not eligible"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">
                        Voice
                      </div>
                      <div className="mt-1 text-sm">
                        {mobile && voiceAllowed
                          ? "Eligible"
                          : "Not eligible"}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
                >
                  {saving
                    ? "Updating..."
                    : "Update CRM Lead"}
                </button>
              </form>

              )}

              {selectedLead && (
                <>
                  <LeadCommunicationTimeline leadId={selectedLead.id} />

                  <div className="mt-6">
                    <WhatsAppConversation leadId={selectedLead.id} />
                  </div>
                </>
              )}
          </section>
        </div>
      </div>
    </main>
  );
}
