"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

const products = [
  {
    name: "AI Command Center",
    href: "/product/ai",
    description: "Institutional intelligence",
  },
  {
    name: "Education ERP",
    href: "/product/erp",
    description: "Campus operations",
  },
  {
    name: "Admissions CRM",
    href: "/product/crm",
    description: "Admissions & enquiries",
  },
  {
    name: "Learning Platform",
    href: "/product/lms",
    description: "Teaching & learning",
  },
  {
    name: "Business Management",
    href: "/product/bms",
    description: "Finance & operations",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
    setProductOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="shrink-0 text-xl font-bold tracking-tight text-slate-950"
        >
          SmartCampus<span className="text-slate-500">AI</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setProductOpen(true)}
            onMouseLeave={() => setProductOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
              aria-expanded={productOpen}
            >
              Platform
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  productOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {productOpen && (
              <div className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  {products.map((product) => (
                    <Link
                      key={product.href}
                      href={product.href}
                      className="block rounded-xl px-4 py-3 transition hover:bg-slate-50"
                    >
                      <p className="text-sm font-semibold text-slate-950">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {product.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/solutions"
            className="text-sm font-semibold text-slate-700 transition hover:text-slate-950"
          >
            Solutions
          </Link>

          <Link
            href="/#features"
            className="text-sm font-semibold text-slate-700 transition hover:text-slate-950"
          >
            Features
          </Link>

          <Link
            href="/pricing"
            className="text-sm font-semibold text-slate-700 transition hover:text-slate-950"
          >
            Pricing
          </Link>

          <Link
            href="/contact"
            className="text-sm font-semibold text-slate-700 transition hover:text-slate-950"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Sign in
          </Link>

          <Link
            href="/demo"
            className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Get started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-6 py-5">
            <div className="pb-2">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Platform
              </p>

              {products.map((product) => (
                <Link
                  key={product.href}
                  href={product.href}
                  onClick={closeMenu}
                  className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {product.name}
                </Link>
              ))}
            </div>

            <Link
              href="/solutions"
              onClick={closeMenu}
              className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Solutions
            </Link>

            <Link
              href="/#features"
              onClick={closeMenu}
              className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Features
            </Link>

            <Link
              href="/pricing"
              onClick={closeMenu}
              className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Pricing
            </Link>

            <Link
              href="/contact"
              onClick={closeMenu}
              className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Contact
            </Link>

            <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
              <Link
                href="/login"
                onClick={closeMenu}
                className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
              >
                Sign in
              </Link>

              <Link
                href="/demo"
                onClick={closeMenu}
                className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
