"use client";

export default function ExportButton({ schoolId }: { schoolId: string }) {
  const handleExport = () => {
    window.location.href = `/api/export?schoolId=${schoolId}`;
  };

  return (
    <button
      onClick={handleExport}
      style={{
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "13px"
      }}
    >
      📥 Export Roster (CSV)
    </button>
  );
}
