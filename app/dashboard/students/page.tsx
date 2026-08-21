'use client';

import { useState } from "react";

export default function StudentManagementPage() {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock student database for the active tenant workspace
  const [students, setStudents] = useState([
    { id: "ADM-2026-001", name: "Aarav Sharma", grade: "Grade 10-A", guardian: "Vikram Sharma (Father)", phone: "+91 98112 33445", status: "ACTIVE", feeStatus: "Paid" },
    { id: "ADM-2026-002", name: "Diya Patel", grade: "Grade 10-A", guardian: "Anil Patel (Father)", phone: "+91 98223 44556", status: "ACTIVE", feeStatus: "Pending" },
    { id: "ADM-2026-003", name: "Rohan Verma", grade: "Grade 12-Science", guardian: "Sunita Verma (Mother)", phone: "+91 98334 55667", status: "TRANSFERRED", feeStatus: "Cleared" },
    { id: "ADM-2026-004", name: "Ananya Iyer", grade: "Grade 9-B", guardian: "Ramesh Iyer (Father)", phone: "+91 98445 66778", status: "ACTIVE", feeStatus: "Paid" },
    { id: "ADM-2026-005", name: "Kabir Khan", grade: "Grade 11-Commerce", guardian: "Zoya Khan (Mother)", phone: "+91 98556 77889", status: "GRADUATED", feeStatus: "Cleared" },
  ]);

  const [newStudent, setNewStudent] = useState({
    name: "",
    grade: "Grade 10-A",
    guardian: "",
    phone: "",
    feeStatus: "Pending"
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.guardian) return;

    const studentRecord = {
      id: `ADM-2026-00${students.length + 1}`,
      ...newStudent,
      status: "ACTIVE"
    };

    setStudents([studentRecord, ...students]);
    setNewStudent({ name: "", grade: "Grade 10-A", guardian: "", phone: "", feeStatus: "Pending" });
    setShowAddModal(false);
  };

  const filteredStudents = students.filter((st: any) => {
    const matchesStatus = filterStatus === "ALL" || st.status === filterStatus;
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) || st.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full font-semibold border border-indigo-500/20">
            Tenant Isolated Core Module
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Student Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage student lifecycles, guardian relationships, fee states, and academic records.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-3 rounded-xl transition shadow-lg shadow-indigo-600/30"
        >
          + Enroll New Student
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row justify-between gap-4 items-center">
        <input 
          type="text"
          placeholder="Search by student name or admission ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-96 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        />

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "ACTIVE", "TRANSFERRED", "GRADUATED"].map((status: any) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                filterStatus === status 
                  ? "bg-indigo-600 text-white shadow" 
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Student Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200 flex justify-between items-center">
          <span>Enrolled Directory ({filteredStudents.length} records)</span>
          <span className="text-xs text-slate-500 font-mono">RLS Tenant Isolation Active</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Admission ID</th>
                <th className="px-6 py-3 font-semibold">Student Name</th>
                <th className="px-6 py-3 font-semibold">Class / Section</th>
                <th className="px-6 py-3 font-semibold">Guardian / Contact</th>
                <th className="px-6 py-3 font-semibold">Lifecycle Status</th>
                <th className="px-6 py-3 font-semibold">Fee State</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st: any) => (
                  <tr key={st.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-mono font-bold text-indigo-400">{st.id}</td>
                    <td className="px-6 py-4 font-bold text-white">{st.name}</td>
                    <td className="px-6 py-4 text-slate-300">{st.grade}</td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300 font-medium">{st.guardian}</div>
                      <div className="text-[11px] font-mono text-slate-500">{st.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        st.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        st.status === "TRANSFERRED" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-slate-700/50 text-slate-300 border border-slate-600"
                      }`}>
                        {st.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${st.feeStatus === "Paid" || st.feeStatus === "Cleared" ? "text-emerald-400" : "text-amber-400"}`}>
                        {st.feeStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="text-slate-400 hover:text-white font-medium">Profile</button>
                      <button className="text-indigo-400 hover:text-indigo-300 font-medium">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No student records found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adding Student */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Enroll New Student</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white font-bold">&times;</button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Student Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Rohan Gupta"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Class / Section</label>
                  <select
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Grade 9-A">Grade 9-A</option>
                    <option value="Grade 10-A">Grade 10-A</option>
                    <option value="Grade 11-Commerce">Grade 11-Commerce</option>
                    <option value="Grade 12-Science">Grade 12-Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Fee State</label>
                  <select
                    value={newStudent.feeStatus}
                    onChange={(e) => setNewStudent({...newStudent, feeStatus: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Cleared">Cleared</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Guardian Name & Relationship</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Mukesh Gupta (Father)"
                  value={newStudent.guardian}
                  onChange={(e) => setNewStudent({...newStudent, guardian: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Contact Phone</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+91 98989 89898"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl text-xs transition border border-slate-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-indigo-600/30"
                >
                  Save Student Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
