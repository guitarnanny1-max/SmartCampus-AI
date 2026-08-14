"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export default function VisitorCount() {
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadVisitorCount() {
      try {
        const response = await fetch(
          "/api/analytics/visitors",
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (mounted && typeof data.visitors === "number") {
          setVisitors(data.visitors);
        }
      } catch (error) {
        console.error(
          "Unable to load visitor count:",
          error,
        );
      }
    }

    loadVisitorCount();

    return () => {
      mounted = false;
    };
  }, []);

  if (visitors === null) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
      <Eye className="h-4 w-4 text-indigo-600" />

      <span>
        <strong className="font-semibold text-slate-900">
          {visitors.toLocaleString("en-IN")}
        </strong>{" "}
        website visitors
      </span>
    </div>
  );
}
