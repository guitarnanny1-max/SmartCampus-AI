"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type ThreeDButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function ThreeDButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
}: ThreeDButtonProps) {
  const baseClass =
    "group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 ease-out hover:-translate-y-1 active:translate-y-[2px]";

  const primaryClass =
    "bg-indigo-600 text-white shadow-[0_6px_0_0_#3730a3,0_12px_25px_-8px_rgba(79,70,229,0.55)] hover:bg-indigo-500 active:shadow-[0_3px_0_0_#3730a3,0_6px_15px_-8px_rgba(79,70,229,0.45)]";

  const secondaryClass =
    "border border-slate-200 bg-white text-slate-900 shadow-[0_5px_0_0_#cbd5e1,0_10px_22px_-10px_rgba(15,23,42,0.25)] hover:bg-slate-50 active:shadow-[0_2px_0_0_#cbd5e1,0_5px_12px_-8px_rgba(15,23,42,0.2)]";

  const classes = `${baseClass} ${
    variant === "primary" ? primaryClass : secondaryClass
  } ${className}`;

  const content = (
    <>
      <span className="absolute inset-x-0 top-0 h-px bg-white/40" />
      <span className="relative">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
