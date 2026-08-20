"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TenantOnboardingForm() {
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [subscriptionTier, setSubscriptionTier] = useState("TRIAL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subdomain) {
      setError("School Name and Subdomain are required.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          subdomain: subdomain.toLowerCase(),
          primaryColor,
          subscriptionTier
        })
      });
      if (res.ok) {
        setName("");
        setSubdomain("");
        setPrimaryColor("#2563eb");
        setSubscriptionTier("TRIAL");
        setSuccess("✅ Monetized tenant successfully provisioned!");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to provision tenant.");
      }
    } catch (err) {
      setError("An error occurred during provisioning.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#1e293b", color: "white", padding: "30px", borderRadius: "12px", marginTop: "30px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
      <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>🚀 Onboard Monetized Institution Tenant</h3>
      <p style={{ margin: "0 0 20px 0", color: "#94a3b8", fontSize: "14px" }}>Provision an isolated multi-tenant instance with custom brand colors and INR billing tiers.</p>
      
      {error && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "15px", fontWeight: "bold" }}>❌ {error}</div>}
      {success && <div style={{ color: "#4ade80", fontSize: "13px", marginBottom: "15px", fontWeight: "bold" }}>{success}</div>}

      <form onSubmit={handleOnboard} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="School Name (e.g. Apex Academy)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #475569", background: "#334155", color: "white", fontSize: "14px" }}
          required
        />
        <input
          type="text"
          placeholder="Subdomain (e.g. apex)"
          value={subdomain}
          onChange={(e) => setSubdomain(e.target.value)}
          style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #475569", background: "#334155", color: "white", fontSize: "14px" }}
          required
        />
        <div style={{ display: "flex", gap: "10px", alignItems: "center", background: "#334155", padding: "8px 14px", borderRadius: "6px", border: "1px solid #475569" }}>
          <label style={{ fontSize: "13px", color: "#cbd5e1" }}>Theme:</label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            style={{ border: "none", width: "26px", height: "26px", cursor: "pointer", background: "none" }}
          />
        </div>
        <select
          value={subscriptionTier}
          onChange={(e) => setSubscriptionTier(e.target.value)}
          style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #475569", background: "#334155", color: "white", fontSize: "14px", cursor: "pointer" }}
        >
          <option value="FREE">Plan: Free Tier (₹0)</option>
          <option value="TRIAL">Plan: 14-Day Free Trial</option>
          <option value="PRO">Plan: Pro Tier (₹39,999/mo)</option>
          <option value="ENTERPRISE">Plan: Enterprise (₹1,19,999/mo)</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          style={{ background: "#2563eb", color: "white", border: "none", padding: "11px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "14px", gridColumn: "1 / -1" }}
        >
          {loading ? "Provisioning..." : "⚡ Provision Monetized Tenant"}
        </button>
      </form>
    </div>
  );
}
