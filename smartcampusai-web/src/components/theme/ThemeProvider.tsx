"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeDefinition = {
  primary: string;
  secondary: string;
  accent: string;
  primaryDark: string;
  primarySoft: string;
  secondarySoft: string;
  accentSoft: string;
  occasion1: string;
  occasion2: string;
  occasion3: string;
};

type Occasion = {
  id: string;
  name: string;
  colors: [string, string, string];
};

const DEFAULT_THEME: ThemeDefinition = {
  primary: "#334155",
  secondary: "#64748B",
  accent: "#0F766E",
  primaryDark: "#1E293B",
  primarySoft: "#F8FAFC",
  secondarySoft: "#F1F5F9",
  accentSoft: "#F0FDFA",
  occasion1: "transparent",
  occasion2: "transparent",
  occasion3: "transparent",
};

const STORAGE_KEY = "smartcampusai-living-theme";
const AUTO_OCCASION_KEY = "smartcampusai-auto-occasion";
const MANUAL_OCCASION_KEY = "smartcampusai-manual-occasion";

const OCCASIONS: Occasion[] = [
  {
    id: "independence",
    name: "Independence Day",
    colors: ["#FF9933", "#FFFFFF", "#138808"],
  },
  {
    id: "republic",
    name: "Republic Day",
    colors: ["#FF9933", "#FFFFFF", "#138808"],
  },
  {
    id: "diwali",
    name: "Diwali",
    colors: ["#D97706", "#F59E0B", "#991B1B"],
  },
  {
    id: "christmas",
    name: "Christmas",
    colors: ["#B91C1C", "#166534", "#F8FAFC"],
  },
  {
    id: "holi",
    name: "Holi",
    colors: ["#E11D48", "#F59E0B", "#0891B2"],
  },
  {
    id: "eid",
    name: "Eid",
    colors: ["#047857", "#D4A017", "#F8FAFC"],
  },
  {
    id: "sankranti",
    name: "Sankranti / Pongal",
    colors: ["#EA580C", "#EAB308", "#15803D"],
  },
];

type ThemeContextValue = {
  theme: ThemeDefinition;
  automaticOccasions: boolean;
  manualOccasion: string | null;
  activeOccasion: Occasion | null;
  setCustomTheme: (
    primary: string,
    accent: string,
    secondary?: string,
  ) => void;
  setAutomaticOccasions: (enabled: boolean) => void;
  setManualOccasion: (occasionId: string | null) => void;
  resetTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function darken(hex: string, amount = 0.15) {
  const value = hex.replace("#", "");

  if (value.length !== 6) return hex;

  const r = Math.max(
    0,
    Math.round(parseInt(value.slice(0, 2), 16) * (1 - amount)),
  );
  const g = Math.max(
    0,
    Math.round(parseInt(value.slice(2, 4), 16) * (1 - amount)),
  );
  const b = Math.max(
    0,
    Math.round(parseInt(value.slice(4, 6), 16) * (1 - amount)),
  );

  return `#${[r, g, b]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("")}`;
}

function soft(hex: string) {
  const value = hex.replace("#", "");

  if (value.length !== 6) return hex;

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  const mix = (channel: number) =>
    Math.round(channel + (255 - channel) * 0.9);

  return `#${[mix(r), mix(g), mix(b)]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("")}`;
}

const FESTIVAL_DATES: Record<number, Record<string, string>> = {
  2026: {
    sankranti: "01-14",
    holi: "03-04",
    eid: "03-20",
    diwali: "11-08",
  },
};

function getCalendarOccasion(
  year: number,
  month: number,
  day: number,
): Occasion | null {
  const monthDay = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  if (month === 8 && day === 15) {
    return OCCASIONS.find((item) => item.id === "independence") ?? null;
  }

  if (month === 1 && day === 26) {
    return OCCASIONS.find((item) => item.id === "republic") ?? null;
  }

  if (month === 12 && day === 25) {
    return OCCASIONS.find((item) => item.id === "christmas") ?? null;
  }

  const festivalDates = FESTIVAL_DATES[year];

  if (!festivalDates) {
    return null;
  }

  const festival = Object.entries(festivalDates).find(
    ([, date]) => date === monthDay,
  );

  if (!festival) {
    return null;
  }

  return OCCASIONS.find((item) => item.id === festival[0]) ?? null;
}

function getAutomaticOccasion(date = new Date()): Occasion | null {
  return getCalendarOccasion(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
}

function getStoredTheme(): ThemeDefinition {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  try {
    const storedTheme = localStorage.getItem(STORAGE_KEY);

    if (!storedTheme) {
      return DEFAULT_THEME;
    }

    const parsed = JSON.parse(storedTheme);

    if (
      parsed &&
      typeof parsed.primary === "string" &&
      typeof parsed.accent === "string"
    ) {
      return {
        ...DEFAULT_THEME,
        ...parsed,
        secondary:
          typeof parsed.secondary === "string"
            ? parsed.secondary
            : DEFAULT_THEME.secondary,
      };
    }
  } catch {
    // Fall back to the default theme when persisted data is invalid.
  }

  return DEFAULT_THEME;
}

function getStoredAutomaticOccasions(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    const storedAutomatic = localStorage.getItem(AUTO_OCCASION_KEY);

    return storedAutomatic === null
      ? true
      : storedAutomatic === "true";
  } catch {
    return true;
  }
}

function getStoredManualOccasion(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(MANUAL_OCCASION_KEY);
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeDefinition>(getStoredTheme);
  const [automaticOccasions, setAutomaticOccasionsState] = useState(
    getStoredAutomaticOccasions,
  );
  const [manualOccasion, setManualOccasionState] = useState<string | null>(
    getStoredManualOccasion,
  );
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setToday(new Date());
    }, 60 * 60 * 1000);

    return () => window.clearInterval(timer);
  }, []);

  const automaticOccasion = useMemo(() => {
    return getAutomaticOccasion(today);
  }, [today]);

  const selectedManualOccasion = useMemo(() => {
    if (!manualOccasion) return null;

    return OCCASIONS.find((item) => item.id === manualOccasion) ?? null;
  }, [manualOccasion]);

  const activeOccasion = selectedManualOccasion
    ? selectedManualOccasion
    : automaticOccasions
      ? automaticOccasion
      : null;

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--sc-primary", theme.primary);
    root.style.setProperty("--sc-primary-dark", theme.primaryDark);
    root.style.setProperty("--sc-primary-soft", theme.primarySoft);

    root.style.setProperty("--sc-secondary", theme.secondary);
    root.style.setProperty("--sc-secondary-soft", theme.secondarySoft);

    root.style.setProperty("--sc-accent", theme.accent);
    root.style.setProperty("--sc-accent-soft", theme.accentSoft);

    root.style.setProperty(
      "--sc-occasion-1",
      activeOccasion?.colors[0] ?? "transparent",
    );
    root.style.setProperty(
      "--sc-occasion-2",
      activeOccasion?.colors[1] ?? "transparent",
    );
    root.style.setProperty(
      "--sc-occasion-3",
      activeOccasion?.colors[2] ?? "transparent",
    );

    root.style.setProperty("--sc-selection", theme.primary);

    root.style.setProperty("--sc-blue", theme.primary);
    root.style.setProperty("--sc-blue-dark", theme.primaryDark);
    root.style.setProperty("--sc-blue-soft", theme.primarySoft);

    root.style.setProperty("--sc-cyan", theme.secondary);
    root.style.setProperty("--sc-cyan-soft", theme.secondarySoft);

    root.style.setProperty("--sc-indigo", theme.primary);
    root.style.setProperty("--sc-indigo-soft", theme.primarySoft);
  }, [theme, activeOccasion]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      automaticOccasions,
      manualOccasion,
      activeOccasion,

      setCustomTheme: (
        primary: string,
        accent: string,
        secondary?: string,
      ) => {
        setTheme((current) => {
          const nextTheme: ThemeDefinition = {
            ...current,
            primary,
            accent,
            secondary: secondary ?? current.secondary,
            primaryDark: darken(primary),
            primarySoft: soft(primary),
            secondarySoft: soft(secondary ?? current.secondary),
            accentSoft: soft(accent),
          };

          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTheme));

          return nextTheme;
        });
      },

      setAutomaticOccasions: (enabled: boolean) => {
        setAutomaticOccasionsState(enabled);
        localStorage.setItem(AUTO_OCCASION_KEY, String(enabled));
      },

      setManualOccasion: (occasionId: string | null) => {
        setManualOccasionState(occasionId);

        if (occasionId) {
          localStorage.setItem(MANUAL_OCCASION_KEY, occasionId);
        } else {
          localStorage.removeItem(MANUAL_OCCASION_KEY);
        }
      },

      resetTheme: () => {
        setTheme(DEFAULT_THEME);
        setAutomaticOccasionsState(true);
        setManualOccasionState(null);

        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(AUTO_OCCASION_KEY);
        localStorage.removeItem(MANUAL_OCCASION_KEY);
      },
    }),
    [theme, automaticOccasions, manualOccasion, activeOccasion],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
