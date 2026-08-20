import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import TenantAiCopilot from "../../components/TenantAiCopilot";

const prisma = new PrismaClient();

interface PageProps {
  params: {
    subdomain: string;
  };
}

// Server Action for handling mock payment & upgrade
async function handleUpgrade(formData: FormData) {
  "use server";
  const subdomain = formData.get("subdomain") as string;
  const tier = formData.get("tier") as string;

  await prisma.school.update({
    where: { subdomain },
    data: { subscriptionTier: tier, subscriptionStatus: "ACTIVE" }
  });

  revalidatePath(`/[subdomain]`, "page");
}

// Server Action for adding a new student
async function addStudent(formData: FormData) {
  "use server";
  const subdomain = formData.get("subdomain") as string;
  const name = formData.get("name") as string;
  const rollNo = formData.get("rollNo") as string;
  const cgpa = parseFloat(formData.get("cgpa") as string) || 0.0;

  const school = await prisma.school.findFirst({ where: { subdomain } });
  if (school && name && rollNo) {
    await prisma.student.create({
      data: { name, rollNo, cgpa, schoolId: school.id }
    });
    revalidatePath(`/[subdomain]`, "page");
  }
}

// Server Action for adding staff member
async function addStaff(formData: FormData) {
  "use server";
  const subdomain = formData.get("subdomain") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  const school = await prisma.school.findFirst({ where: { subdomain } });
  if (school && name && email) {
    await prisma.staff.create({
      data: { name, email, role: role || "TEACHER", schoolId: school.id }
    });
    revalidatePath(`/[subdomain]`, "page");
  }
}

// Server Action for logging a maintenance ticket
async function addTicket(formData: FormData) {
  "use server";
  const subdomain = formData.get("subdomain") as string;
  const title = formData.get("title") as string;
  const severity = formData.get("severity") as string;
  const description = formData.get("description") as string;

  const school = await prisma.school.findFirst({ where: { subdomain } });
  if (school && title && description) {
    await prisma.ticket.create({
      data: { title, severity: severity || "MEDIUM", description, schoolId: school.id }
    });
    revalidatePath(`/[subdomain]`, "page");
  }
}

// Server Action for creating a fee invoice
async function addFee(formData: FormData) {
  "use server";
  const subdomain = formData.get("subdomain") as string;
  const title = formData.get("title") as string;
  const amount = parseFloat(formData.get("amount") as string) || 0;
  const dueDate = formData.get("dueDate") as string;

  const school = await prisma.school.findFirst({ where: { subdomain } });
  if (school && title && amount) {
    await prisma.fee.create({
      data: { title, amount, dueDate: dueDate || "2026-03-31", schoolId: school.id }
    });
    revalidatePath(`/[subdomain]`, "page");
  }
}

// Server Action for toggling fee status (Paid / Pending)
async function toggleFeeStatus(formData: FormData) {
  "use server";
  const feeId = formData.get("feeId") as string;
  const currentStatus = formData.get("currentStatus") as string;
  const newStatus = currentStatus === "PAID" ? "PENDING" : "PAID";

  await prisma.fee.update({
    where: { id: feeId },
    data: { status: newStatus }
  });

  revalidatePath(`/[subdomain]`, "page");
}

// Server Action for toggling facility status
async function toggleFacilityStatus(formData: FormData) {
  "use server";
  const facilityId = formData.get("facilityId") as string;
  const currentStatus = formData.get("currentStatus") as string;
  const newStatus = currentStatus === "Operational" ? "Maintenance Required" : "Operational";

  await prisma.facility.update({
    where: { id: facilityId },
    data: { status: newStatus }
  });

  revalidatePath(`/[subdomain]`, "page");
}

export default async function TenantPortal({ params }: PageProps) {
  const { subdomain } = params;

  const school = await prisma.school.findFirst({
    where: { subdomain },
    include: { students: true, facilities: true, tickets: true, staff: true, fees: true }
  });

  if (!school) {
    notFound();
  }

  const brandColor = school.primaryColor || "#2563eb";
  const isPaidOrTrial = school.subscriptionTier === "PRO" || school.subscriptionTier === "ENTERPRISE" || school.subscriptionTier === "TRIAL";

  const totalCollected = school.fees.filter(f => f.status === "PAID").reduce((acc, f) => acc + f.amount, 0);
  const totalPending = school.fees.filter(f => f.status === "PENDING").reduce((acc, f) => acc + f.amount, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Dynamic Brand Header */}
      <header style={{ background: brandColor, color: "white", padding: "30px 40px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ background: "#ffffff", color: brandColor, padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>
                {school.subscriptionTier === "TRIAL" ? "14-Day Free Trial" : `${school.subscriptionTier} PLAN`}
              </span>
            </div>
            <h1 style={{ margin: "5px 0 5px 0", fontSize: "32px" }}>{school.name}</h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "15px" }}>Subdomain: {subdomain}.localhost:3000</p>
          </div>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 20px", borderRadius: "8px", textAlign: "right" }}>
            <p style={{ margin: "0 0 2px 0", fontSize: "12px", opacity: 0.8 }}>Tenant ID</p>
            <code style={{ fontSize: "13px", fontWeight: "bold" }}>{school.id.slice(0, 10)}...</code>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
        
        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          <div style={{ background: "white", padding: "24px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderLeft: `5px solid ${brandColor}` }}>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Registered Students</span>
            <h3 style={{ margin: "8px 0 0 0", fontSize: "26px", color: "#0f172a" }}>{school.students.length}</h3>
          </div>
          <div style={{ background: "white", padding: "24px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderLeft: "5px solid #16a34a" }}>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Fee Collected</span>
            <h3 style={{ margin: "8px 0 0 0", fontSize: "26px", color: "#16a34a" }}>₹{totalCollected.toLocaleString('en-IN')}</h3>
          </div>
          <div style={{ background: "white", padding: "24px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderLeft: "5px solid #dc2626" }}>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Fee Pending</span>
            <h3 style={{ margin: "8px 0 0 0", fontSize: "26px", color: "#dc2626" }}>₹{totalPending.toLocaleString('en-IN')}</h3>
          </div>
          <div style={{ background: "white", padding: "24px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderLeft: "5px solid #9333ea" }}>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Staff Members</span>
            <h3 style={{ margin: "8px 0 0 0", fontSize: "26px", color: "#0f172a" }}>{school.staff.length}</h3>
          </div>
        </div>

        {/* Upgrade Banner for Trial / Free Users */}
        {school.subscriptionTier !== "PRO" && school.subscriptionTier !== "ENTERPRISE" && (
          <div style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", color: "white", padding: "30px", borderRadius: "12px", marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>⚡ Unlock Full Power with Pro Tier</h3>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>Upgrade to Pro (₹39,999/mo) to unlock unlimited AI Copilot features and priority support.</p>
            </div>
            <form action={handleUpgrade} style={{ display: "flex", gap: "10px" }}>
              <input type="hidden" name="subdomain" value={subdomain} />
              <input type="hidden" name="tier" value="PRO" />
              <button type="submit" style={{ background: "#2563eb", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>
                Pay ₹39,999 & Upgrade Now 🚀
              </button>
            </form>
          </div>
        )}

        {/* Management Forms Grid (Students, Staff, Fees) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px", marginBottom: "30px", alignItems: "start" }}>
          
          {/* Enroll Student Form */}
          <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#0f172a", fontSize: "18px" }}>➕ Enroll Student</h3>
            <form action={addStudent} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="hidden" name="subdomain" value={subdomain} />
              <input type="text" name="name" placeholder="Student Full Name" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              <input type="text" name="rollNo" placeholder="Roll No (e.g. SC-2026-099)" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              <input type="number" step="0.01" min="0" max="10" name="cgpa" placeholder="CGPA (e.g. 9.1)" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              <button type="submit" style={{ background: brandColor, color: "white", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>Register Student</button>
            </form>
          </div>

          {/* Invite Staff Form */}
          <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#0f172a", fontSize: "18px" }}>👤 Invite Staff / Teacher</h3>
            <form action={addStaff} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="hidden" name="subdomain" value={subdomain} />
              <input type="text" name="name" placeholder="Staff Full Name" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              <input type="email" name="email" placeholder="Email Address" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              <select name="role" style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", background: "white" }}>
                <option value="TEACHER">Role: Teacher</option>
                <option value="ADMIN">Role: Co-Administrator</option>
                <option value="SUPPORT">Role: Facilities Support</option>
              </select>
              <button type="submit" style={{ background: "#16a34a", color: "white", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>Grant Access</button>
            </form>
          </div>

          {/* Issue Fee Invoice Form */}
          <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#0f172a", fontSize: "18px" }}>💵 Issue Fee Invoice</h3>
            <form action={addFee} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="hidden" name="subdomain" value={subdomain} />
              <input type="text" name="title" placeholder="Fee Title (e.g. Term 1 Tuition)" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              <input type="number" name="amount" placeholder="Amount in ₹ (e.g. 25000)" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              <input type="date" name="dueDate" required defaultValue="2026-03-31" style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              <button type="submit" style={{ background: "#9333ea", color: "white", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>Create Invoice</button>
            </form>
          </div>

        </div>

        {/* Rosters & Tables Grid (Students, Staff, Fees) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px", marginBottom: "30px", alignItems: "start" }}>
          
          {/* Student Roster */}
          <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#0f172a", fontSize: "18px" }}>🎓 Student Roster ({school.students.length})</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b", fontSize: "13px" }}>
                  <th style={{ padding: "10px" }}>Name</th>
                  <th style={{ padding: "10px" }}>Roll No</th>
                  <th style={{ padding: "10px" }}>CGPA</th>
                </tr>
              </thead>
              <tbody>
                {school.students.map((student) => (
                  <tr key={student.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px", color: "#0f172a", fontWeight: "500" }}>{student.name}</td>
                    <td style={{ padding: "10px", color: "#64748b" }}>{student.rollNo}</td>
                    <td style={{ padding: "10px", color: "#0f172a", fontWeight: "bold" }}>{student.cgpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fee Collection Ledger */}
          <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#0f172a", fontSize: "18px" }}>💰 Fee Collection Ledger ({school.fees.length})</h3>
            {school.fees.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "14px" }}>No fee invoices issued yet.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b", fontSize: "13px" }}>
                    <th style={{ padding: "8px" }}>Invoice</th>
                    <th style={{ padding: "8px" }}>Amount</th>
                    <th style={{ padding: "8px" }}>Status</th>
                    <th style={{ padding: "8px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {school.fees.map((fee) => {
                    const isPaid = fee.status === "PAID";
                    return (
                      <tr key={fee.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "8px", color: "#0f172a", fontWeight: "500", fontSize: "13px" }}>{fee.title}</td>
                        <td style={{ padding: "8px", color: "#0f172a", fontSize: "13px" }}>₹{fee.amount.toLocaleString('en-IN')}</td>
                        <td style={{ padding: "8px" }}>
                          <span style={{ background: isPaid ? "#dcfce7" : "#fee2e2", color: isPaid ? "#166534" : "#991b1b", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold" }}>
                            {fee.status}
                          </span>
                        </td>
                        <td style={{ padding: "8px" }}>
                          <form action={toggleFeeStatus}>
                            <input type="hidden" name="feeId" value={fee.id} />
                            <input type="hidden" name="currentStatus" value={fee.status} />
                            <button type="submit" style={{ background: "white", border: "1px solid #cbd5e1", color: "#334155", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}>
                              Toggle 🔄
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Staff Directory */}
          <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#0f172a", fontSize: "18px" }}>👥 Staff Directory ({school.staff.length})</h3>
            {school.staff.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "14px" }}>No staff members invited yet.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b", fontSize: "13px" }}>
                    <th style={{ padding: "10px" }}>Name</th>
                    <th style={{ padding: "10px" }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {school.staff.map((member) => (
                    <tr key={member.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px", color: "#0f172a", fontWeight: "500" }}>{member.name}</td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ background: "#e0e7ff", color: "#3730a3", padding: "3px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                          {member.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

        {/* Facilities & Support Tickets Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px", alignItems: "start" }}>
          
          {/* Facilities Section */}
          <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#0f172a", fontSize: "18px" }}>🏢 Monitored Campus Facilities</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {school.facilities.map((facility) => {
                const isOperational = facility.status === "Operational";
                return (
                  <div key={facility.id} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "12px 16px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ margin: "0 0 2px 0", color: "#0f172a", fontSize: "14px" }}>{facility.name}</h4>
                      <span style={{ background: isOperational ? "#dcfce7" : "#fee2e2", color: isOperational ? "#166534" : "#991b1b", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold" }}>
                        {facility.status}
                      </span>
                    </div>
                    <form action={toggleFacilityStatus}>
                      <input type="hidden" name="facilityId" value={facility.id} />
                      <input type="hidden" name="currentStatus" value={facility.status} />
                      <button type="submit" style={{ background: "white", border: "1px solid #cbd5e1", color: "#334155", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontWeight: "500" }}>
                        Toggle 🔄
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Support Tickets */}
          <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#0f172a", fontSize: "18px" }}>🛠️ Maintenance Tickets</h3>
            <form action={addTicket} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
              <input type="hidden" name="subdomain" value={subdomain} />
              <input type="text" name="title" placeholder="Issue Title (e.g. Wi-Fi down)" required style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }} />
              <select name="severity" style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", background: "white" }}>
                <option value="LOW">Severity: Low</option>
                <option value="MEDIUM">Severity: Medium</option>
                <option value="HIGH">Severity: High / Urgent</option>
              </select>
              <input type="text" name="description" placeholder="Short description..." required style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }} />
              <button type="submit" style={{ background: "#d97706", color: "white", border: "none", padding: "8px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>Submit Ticket</button>
            </form>
          </div>

        </div>

        {/* Conditional Feature Gate for AI Copilot */}
        {isPaidOrTrial ? (
          <TenantAiCopilot subdomain={subdomain} brandColor={brandColor} />
        ) : (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "25px", borderRadius: "10px", textAlign: "center" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#92400e", fontSize: "18px" }}>🔒 AI Copilot Locked</h4>
            <p style={{ margin: "0 0 15px 0", color: "#b45309", fontSize: "14px" }}>Upgrade to Pro (₹39,999/mo) or Enterprise tier to unlock the Tenant Intelligence AI Assistant.</p>
          </div>
        )}

      </main>
    </div>
  );
}
