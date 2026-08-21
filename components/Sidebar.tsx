import Link from "next/link";

interface SidebarProps {
  schoolName?: string;
  subdomain?: string;
  role?: string;
  setRole?: (role: string) => void;
}

export default function Sidebar({ schoolName = "SmartCampus", subdomain = "app", role = "ADMIN", setRole }: SidebarProps) {
  return (
    <aside style={{ width: "260px", background: "#0f172a", color: "#f8fafc", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "4px", color: "#38bdf8" }}>{schoolName}</div>
        <div style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace", marginBottom: "24px" }}>{subdomain}.smartcampus.ai</div>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
          <Link href="/" style={{ color: "#e2e8f0", textDecoration: "none", padding: "8px 12px", borderRadius: "6px" }}>Dashboard</Link>
          <Link href="/students" style={{ color: "#e2e8f0", textDecoration: "none", padding: "8px 12px", borderRadius: "6px" }}>Students</Link>
          <Link href="/staff" style={{ color: "#e2e8f0", textDecoration: "none", padding: "8px 12px", borderRadius: "6px" }}>Staff</Link>
          <Link href="/finance" style={{ color: "#e2e8f0", textDecoration: "none", padding: "8px 12px", borderRadius: "6px" }}>Finance</Link>
          <Link href="/energy" style={{ color: "#e2e8f0", textDecoration: "none", padding: "8px 12px", borderRadius: "6px" }}>Energy</Link>
          <Link href="/exams" style={{ color: "#e2e8f0", textDecoration: "none", padding: "8px 12px", borderRadius: "6px" }}>Exams</Link>
          <Link href="/library" style={{ color: "#e2e8f0", textDecoration: "none", padding: "8px 12px", borderRadius: "6px" }}>Library</Link>
          <Link href="/transport" style={{ color: "#e2e8f0", textDecoration: "none", padding: "8px 12px", borderRadius: "6px" }}>Transport</Link>
          <Link href="/reports" style={{ color: "#e2e8f0", textDecoration: "none", padding: "8px 12px", borderRadius: "6px" }}>Reports</Link>
        </nav>
      </div>

      {setRole && (
        <div style={{ marginTop: "24px", borderTop: "1px solid #1e293b", paddingTop: "16px" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "8px" }}>Current Role: {role}</div>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: "6px", background: "#1e293b", color: "#fff", border: "1px solid #334155", borderRadius: "4px", fontSize: "12px" }}
          >
            <option value="ADMIN">Admin</option>
            <option value="TEACHER">Teacher</option>
            <option value="STUDENT">Student</option>
          </select>
        </div>
      )}
    </aside>
  );
}
