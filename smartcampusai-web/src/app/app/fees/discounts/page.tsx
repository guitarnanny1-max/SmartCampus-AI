"use client";

import { FormEvent, useEffect, useState } from "react";

type Discount = {
  id: string;
  name: string;
  code: string | null;
  discount_type: "FIXED" | "PERCENTAGE";
  value: number;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
};

export default function FeeDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"FIXED" | "PERCENTAGE">(
    "FIXED"
  );
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  async function loadDiscounts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/fee-discounts");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load discounts");
      }

      setDiscounts(data.discounts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load discounts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDiscounts();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const numericValue = Number(value);

      if (!name.trim()) {
        throw new Error("Discount name is required");
      }

      if (!Number.isFinite(numericValue) || numericValue < 0) {
        throw new Error("Enter a valid non-negative discount value");
      }

      if (discountType === "PERCENTAGE" && numericValue > 100) {
        throw new Error("Percentage discount cannot exceed 100%");
      }

      const response = await fetch("/api/fee-discounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim() || null,
          discount_type: discountType,
          value: numericValue,
          description: description.trim() || null,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create discount");
      }

      setMessage("Discount created successfully.");

      setName("");
      setCode("");
      setDiscountType("FIXED");
      setValue("");
      setDescription("");
      setStatus("ACTIVE");

      await loadDiscounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create discount");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Fee Discounts
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage discounts, concessions, and scholarships.
          </p>
        </div>

        {message && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Create Discount
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-5 grid gap-4 md:grid-cols-2"
          >
            <div>
              <label className="text-sm font-medium text-slate-700">
                Discount Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sibling Discount"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Code
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="SIBLING10"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) =>
                  setDiscountType(
                    e.target.value as "FIXED" | "PERCENTAGE"
                  )
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="FIXED">Fixed Amount (₹)</option>
                <option value="PERCENTAGE">Percentage (%)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                {discountType === "FIXED"
                  ? "Discount Amount (₹)"
                  : "Discount Percentage (%)"}
              </label>
              <input
                type="number"
                min="0"
                max={discountType === "PERCENTAGE" ? 100 : undefined}
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={discountType === "FIXED" ? "5000" : "10"}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "ACTIVE" | "INACTIVE")
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Discount for siblings"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Create Discount"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Discount Master
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-slate-500">
              Loading discounts...
            </div>
          ) : discounts.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No discounts configured yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Code</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Value</th>
                    <th className="px-6 py-3 font-medium">Description</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {discounts.map((discount) => (
                    <tr key={discount.id}>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {discount.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {discount.code || "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {discount.discount_type === "FIXED"
                          ? "Fixed"
                          : "Percentage"}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {discount.discount_type === "FIXED"
                          ? `₹${Number(discount.value).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}`
                          : `${Number(discount.value).toLocaleString("en-IN")}%`}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {discount.description || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            discount.status === "ACTIVE"
                              ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                              : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                          }
                        >
                          {discount.status}
                        </span>
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
