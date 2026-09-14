"use client";

import { useMemo, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

const occasions = [
  {
    id: "independence",
    name: "Independence Day",
    date: "August 15",
    icon: "🇮🇳",
    colors: ["#FF9933", "#FFFFFF", "#138808"],
    description: "Indian tricolor inspired accents",
  },
  {
    id: "republic",
    name: "Republic Day",
    date: "January 26",
    icon: "🇮🇳",
    colors: ["#FF9933", "#FFFFFF", "#138808"],
    description: "Indian national celebration",
  },
  {
    id: "diwali",
    name: "Diwali",
    date: "Festival calendar",
    icon: "🪔",
    colors: ["#D97706", "#F59E0B", "#991B1B"],
    description: "Warm festive gold and amber",
  },
  {
    id: "christmas",
    name: "Christmas",
    date: "December 25",
    icon: "✝️",
    colors: ["#B91C1C", "#166534", "#F8FAFC"],
    description: "Elegant red, evergreen and ivory",
  },
  {
    id: "holi",
    name: "Holi",
    date: "Festival calendar",
    icon: "🎨",
    colors: ["#E11D48", "#F59E0B", "#0891B2"],
    description: "Controlled festive multi-color accents",
  },
  {
    id: "eid",
    name: "Eid",
    date: "Festival calendar",
    icon: "🌙",
    colors: ["#047857", "#D4A017", "#F8FAFC"],
    description: "Emerald, champagne and ivory",
  },
  {
    id: "sankranti",
    name: "Sankranti / Pongal",
    date: "Festival calendar",
    icon: "🪁",
    colors: ["#EA580C", "#EAB308", "#15803D"],
    description: "Harvest-inspired festive accents",
  },
];

export default function ThemeStudioPage() {
  const {
    theme,
    setCustomTheme,
    automaticOccasions,
    manualOccasion,
    activeOccasion: providerActiveOccasion,
    setAutomaticOccasions,
    setManualOccasion,
    resetTheme: resetGlobalTheme,
  } = useTheme();

  const [primary, setPrimary] = useState(theme.primary);
  const [secondary, setSecondary] = useState(theme.secondary);
  const [accent, setAccent] = useState(theme.accent);
  const [selectedOccasion, setSelectedOccasion] = useState(
    manualOccasion ?? "independence",
  );
  const [saved, setSaved] = useState(false);

  const manualOverride = manualOccasion !== null;

  const selectedOccasionData = useMemo(
    () =>
      occasions.find((occasion) => occasion.id === selectedOccasion) ??
      occasions[0],
    [selectedOccasion],
  );

  function saveTheme() {
    setCustomTheme(primary, accent, secondary);

    if (manualOverride) {
      setManualOccasion(selectedOccasion);
    }

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  function resetTheme() {
    setPrimary("#334155");
    setSecondary("#64748B");
    setAccent("#0F766E");
    setAutomaticOccasions(true);
    setManualOccasion(null);
    resetGlobalTheme();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Compact professional hero */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-7">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-orange-500 via-white to-green-600" />

          <div className="flex flex-col gap-4 pl-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Global Appearance
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Living Theme Studio
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Keep your school identity permanent while SmartCampusAI
                automatically adds tasteful occasion accents.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetTheme}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={saveTheme}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
              >
                {saved ? "✓ Saved" : "Save Theme"}
              </button>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_390px]">
          {/* School identity */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Permanent Identity
              </span>
              <h2 className="mt-1 text-xl font-bold text-slate-950">
                School Brand Theme
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                These colors remain your school&apos;s identity throughout the year.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Primary", primary, setPrimary],
                ["Secondary", secondary, setSecondary],
                ["Accent", accent, setAccent],
              ].map(([label, value, setter]) => (
                <label
                  key={label as string}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <span className="mb-3 block text-xs font-bold text-slate-600">
                    {label as string}
                  </span>

                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={value as string}
                      onChange={(event) => {
                        const nextValue = event.target.value;

                        (setter as (value: string) => void)(nextValue);

                        if (label === "Primary") {
                          setCustomTheme(nextValue, accent);
                        } else if (label === "Secondary") {
                          setCustomTheme(primary, nextValue);
                        } else {
                          setCustomTheme(primary, nextValue);
                        }
                      }}
                      className="h-11 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                    />

                    <input
                      value={value as string}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        (setter as (value: string) => void)(nextValue);

                        if (label === "Primary") {
                          setCustomTheme(nextValue, accent);
                        } else if (label === "Secondary") {
                          setCustomTheme(primary, nextValue);
                        } else {
                          setCustomTheme(primary, nextValue);
                        }
                      }}
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold uppercase outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                    />
                  </div>
                </label>
              ))}
            </div>

            {/* Automatic occasion controls */}
            <div className="mt-6 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/70 via-white to-green-50/60 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
                    Seasonal Intelligence
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-slate-950">
                    Automatic Occasion Themes
                  </h3>
                  <p className="mt-1 max-w-xl text-sm text-slate-500">
                    Temporarily enhance your school theme during national days,
                    festivals and school occasions.
                  </p>
                </div>

                <button
                  type="button"
                  aria-pressed={automaticOccasions}
                  onClick={() => setAutomaticOccasions(!automaticOccasions)}
                  className={`relative h-7 w-14 shrink-0 rounded-full transition ${
                    automaticOccasions ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      automaticOccasions ? "left-8" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    Manual Override
                  </div>
                  <div className="text-xs text-slate-500">
                    Temporarily disable automatic occasion styling.
                  </div>
                </div>

                <button
                  type="button"
                  aria-pressed={manualOverride}
                  onClick={() => {
                    if (manualOverride) {
                      setManualOccasion(null);
                    } else {
                      setManualOccasion(selectedOccasion);
                    }
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                    manualOverride
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {manualOverride ? "OVERRIDE ON" : "OFF"}
                </button>
              </div>
            </div>

            {/* Occasion gallery */}
            <div className="mt-6">
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Occasion Library
                </span>
                <h3 className="mt-1 text-lg font-bold text-slate-950">
                  Festival & National Themes
                </h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {occasions.map((occasion) => {
                  const active = selectedOccasion === occasion.id;

                  return (
                    <button
                      key={occasion.id}
                      type="button"
                      onClick={() => {
                        setSelectedOccasion(occasion.id);
                        if (manualOverride) {
                          setManualOccasion(occasion.id);
                        }
                      }}
                      className={`rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-slate-400 bg-slate-50 ring-2 ring-slate-100"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{occasion.icon}</span>

                          <div>
                            <div className="font-bold text-slate-900">
                              {occasion.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {occasion.date}
                            </div>
                          </div>
                        </div>

                        {active && (
                          <span className="rounded-full bg-slate-900 px-2 py-1 text-[9px] font-bold text-white">
                            PREVIEW
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex gap-1.5">
                        {occasion.colors.map((color) => (
                          <span
                            key={color}
                            className="h-6 flex-1 rounded-md border border-black/5"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        {occasion.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Preview */}
          <section className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Preview
              </span>
              <h2 className="mt-1 text-xl font-bold text-slate-950">
                Your Living Theme
              </h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div
                className="relative px-5 py-5 text-white"
                style={{
                  background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                }}
              >
                <div className="absolute inset-x-0 bottom-0 h-1">
                  <div className="flex h-full">
                    {selectedOccasionData.colors.map((color) => (
                      <span
                        key={color}
                        className="flex-1"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  SmartCampusAI
                </div>

                <div className="mt-1 text-xl font-bold">
                  Campus Dashboard
                </div>

                <div className="mt-1 text-xs opacity-80">
                  School identity + occasion layer
                </div>
              </div>

              <div className="space-y-3 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="text-[10px] font-bold text-slate-400">
                      STUDENTS
                    </div>
                    <div
                      className="mt-1 text-xl font-bold"
                      style={{ color: primary }}
                    >
                      248
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="text-[10px] font-bold text-slate-400">
                      STATUS
                    </div>
                    <div
                      className="mt-1 inline-flex rounded-full px-2 py-1 text-[9px] font-bold text-white"
                      style={{ backgroundColor: selectedOccasionData.colors[2] }}
                    >
                      ACTIVE
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full rounded-xl px-4 py-2.5 text-sm font-bold text-white"
                  style={{ backgroundColor: primary }}
                >
                  View Dashboard
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Preview
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-xl">{selectedOccasionData.icon}</span>
                <span className="font-bold text-slate-900">
                  {providerActiveOccasion?.name}
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                The school&apos;s permanent colors remain intact. The occasion
                palette is applied as a restrained seasonal accent.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
