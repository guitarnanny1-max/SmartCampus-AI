'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ShieldAlert, 
  Activity, 
  Cpu, 
  Download, 
  Plus, 
  Zap, 
  Sparkles, 
  Send, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Calendar,
  Award,
  Terminal,
  ArrowUpRight,
  UserPlus,
  Clock,
  Check,
  X,
  CreditCard,
  Printer,
  MessageSquare,
  ShieldCheck,
  Settings,
  BellRing,
  UserCheck,
  Bus,
  MapPin,
  DollarSign,
  Briefcase,
  PhoneCall,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default function DpsUltimateTenantDashboard() {
  const [activeTenant, setActiveTenant] = useState<'dps' | 'greenwood'>('dps');
  
  // AI Co-Pilot Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I'm your AI co-pilot for Delhi Public School. Admissions CRM, attendance, fee collection, bus GPS tracking, and HR payroll are fully active." }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // ESG Audit State
  const [esgStatus, setEsgStatus] = useState('Not yet audited');
  const [isAuditing, setIsAuditing] = useState(false);

  // 1. Admissions CRM State
  const [leads, setLeads] = useState([
    { id: 1, student: 'Aarav Malhotra', parent: 'Vikram Malhotra', phone: '+91 98765 43210', grade: 'Grade 11', status: 'Campus Tour', date: '2026-08-20' },
    { id: 2, student: 'Meera Nair', parent: 'Sunita Nair', phone: '+91 91234 56789', grade: 'Grade 9', status: 'New Inquiry', date: '2026-08-16' },
    { id: 3, student: 'Zainab Khan', parent: 'Tariq Khan', phone: '+91 99887 76655', grade: 'Grade 11', status: 'Application Submitted', date: '2026-08-15' },
    { id: 4, student: 'Rohan Deshmukh', parent: 'Anil Deshmukh', phone: '+91 93456 78901', grade: 'Grade 10', status: 'Enrolled', date: '2026-08-10' }
  ]);
  const [leadName, setLeadName] = useState('');
  const [parentName, setParentName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadGrade, setLeadGrade] = useState('Grade 11');
  const [leadStatus, setLeadStatus] = useState('New Inquiry');

  // 2. Attendance State
  const [studentAttendance, setStudentAttendance] = useState([
    { id: 1, grade: 'Grade 11-A', total: 45, present: 43, absent: 2, status: 'Completed' },
    { id: 2, grade: 'Grade 11-B', total: 42, present: 40, absent: 2, status: 'Completed' },
    { id: 3, grade: 'Grade 12-A', total: 38, present: 37, absent: 1, status: 'Completed' },
    { id: 4, grade: 'Grade 12-B', total: 40, present: 38, absent: 2, status: 'Pending Review' }
  ]);

  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Dr. Ramesh Kumar', subject: 'Mathematics', status: 'Present' },
    { id: 2, name: 'Mrs. Sunita Rao', subject: 'Physics', status: 'Present' },
    { id: 3, name: 'Mr. Arvind Gupta', subject: 'Computer Science', status: 'On Leave' },
    { id: 4, name: 'Ms. Priya Sen', subject: 'English Literature', status: 'Present' }
  ]);

  // 3. Fee Payment State
  const [fees, setFees] = useState([
    { id: 1, student: 'Aarav Sharma', roll: 'DPS-2026-001', amount: '$1,200', status: 'Paid', date: '2026-08-01' },
    { id: 2, student: 'Diya Patel', roll: 'DPS-2026-002', amount: '$1,200', status: 'Pending', date: 'Due 2026-09-01' },
    { id: 3, student: 'Kabir Mehta', roll: 'DPS-2026-003', amount: '$1,200', status: 'Paid', date: '2026-08-03' },
    { id: 4, student: 'Ananya Iyer', roll: 'DPS-2026-004', amount: '$1,200', status: 'Overdue', date: 'Due 2026-08-10' }
  ]);

  // 4. Bus Fleet State
  const [buses, setBuses] = useState([
    { id: 1, route: 'Route A - South Extension', busNo: 'DL-1PC-4892', driver: 'Rajesh Kumar', status: 'On Time', gps: 'GPS Active (Lat 28.61, Lon 77.20)' },
    { id: 2, route: 'Route B - Vasant Vihar', busNo: 'DL-1PC-7712', driver: 'Manoj Singh', status: 'Delayed (10m)', gps: 'GPS Active (Lat 28.55, Lon 77.15)' },
    { id: 3, route: 'Route C - Dwarka Sector 12', busNo: 'DL-1PC-9934', driver: 'Suresh Yadav', status: 'Arrived at School', gps: 'Parked at Campus' }
  ]);

  // 5. HR Activities State
  const [hrStaff, setHrStaff] = useState([
    { id: 1, name: 'Dr. Ramesh Kumar', role: 'Senior Mathematics Professor', department: 'Academics', payrollStatus: 'Processed ($4,200)', leaveBalance: '12 Days' },
    { id: 2, name: 'Mrs. Sunita Rao', role: 'Head of Physics Department', department: 'Science', payrollStatus: 'Processed ($4,500)', leaveBalance: '8 Days' },
    { id: 3, name: 'Mr. Arvind Gupta', role: 'Systems Administrator', department: 'IT & Ops', payrollStatus: 'Pending Approval', leaveBalance: '5 Days' },
    { id: 4, name: 'Ms. Priya Sen', role: 'Senior Counselor', department: 'Student Welfare', payrollStatus: 'Processed ($3,800)', leaveBalance: '15 Days' }
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');

  // WhatsApp Communication State
  const [waRecipient, setWaRecipient] = useState('All Prospective Parents & Staff');
  const [waMessage, setWaMessage] = useState('Dear Parent, welcome to Delhi Public School admissions and transport updates. Thank you!');
  const [waStatus, setWaStatus] = useState('');

  // Admin Activities Log State
  const [adminLogs, setAdminLogs] = useState([
    { time: '10:15 AM', action: 'Lead Status Updated: Aarav Malhotra -> Campus Tour', admin: 'AdmissionsHead' },
    { time: '09:30 AM', action: 'HR Payroll Batch Processed', admin: 'HR_Head' },
    { time: '08:00 AM', action: 'Morning Attendance Logged', admin: 'AcademicHead' }
  ]);
  const [newLogAction, setNewLogAction] = useState('');

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !parentName || !leadPhone) return;
    setLeads([
      { id: leads.length + 1, student: leadName, parent: parentName, phone: leadPhone, grade: leadGrade, status: leadStatus, date: '2026-08-17' },
      ...leads
    ]);
    setLeadName('');
    setParentName('');
    setLeadPhone('');
  };

  const updateLeadStatus = (id: number, newSt: string) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newSt } : l));
  };

  const toggleTeacherAttendance = (id: number) => {
    setTeachers(teachers.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Present' ? 'Absent' : t.status === 'Absent' ? 'On Leave' : 'Present';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const markFeePaid = (id: number) => {
    setFees(fees.map(f => f.id === id ? { ...f, status: 'Paid', date: '2026-08-17' } : f));
  };

  const printBill = (studentName: string) => {
    alert(`📥 Generating official PDF Tax Invoice & Fee Receipt for ${studentName}...`);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffRole) return;
    setHrStaff([
      { id: hrStaff.length + 1, name: newStaffName, role: newStaffRole, department: 'General Admin', payrollStatus: 'Pending Approval', leaveBalance: '14 Days' },
      ...hrStaff
    ]);
    setNewStaffName('');
    setNewStaffRole('');
  };

  const sendWhatsAppBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waMessage.trim()) return;
    setWaStatus('Sending WhatsApp API CRM Broadcast...');
    setTimeout(() => {
      setWaStatus('✅ WhatsApp CRM Campaign delivered successfully!');
      setAdminLogs([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: 'WhatsApp CRM Broadcast Sent', admin: 'AdmissionsAdmin' }, ...adminLogs]);
    }, 1200);
  };

  const logAdminAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogAction.trim()) return;
    setAdminLogs([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: newLogAction, admin: 'TenantAdmin' }, ...adminLogs]);
    setNewLogAction('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = "I've processed your query for Delhi Public School.";
      const lower = userMsg.toLowerCase();
      if (lower.includes('lead') || lower.includes('crm')) {
        reply = `There are ${leads.length} active leads in the admissions pipeline. ${leads.filter(l => l.status === 'Enrolled').length} have converted.`;
      } else if (lower.includes('attendance')) {
        reply = "Overall student attendance today is 95.4%. Faculty attendance is 75% present.";
      } else if (lower.includes('bus') || lower.includes('transport')) {
        reply = "All 3 school bus routes are actively transmitting GPS coordinates. Route B has a minor 10m delay.";
      } else if (lower.includes('hr') || lower.includes('payroll')) {
        reply = "HR payroll batch for August has been successfully queued for approval.";
      } else if (lower.includes('fee')) {
        reply = "Fee collection stands at 75% for Q3.";
      }
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setIsAiThinking(false);
    }, 1000);
  };

  const runEsgAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setEsgStatus('Passed: Carbon offset +18.4% YoY. Scope 2 emissions fully compliant.');
      setIsAuditing(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header & Tenant Switcher */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xl font-mono">
              DPS
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono rounded-full uppercase">
                  Role: TENANT_ADMIN / ALL MODULES
                </span>
                <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono rounded-full">
                  Subdomain: dps
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Delhi Public School Tenant Portal
              </h1>
              <p className="text-slate-400 text-xs md:text-sm">
                Admissions CRM • Attendance • Fee Management • Bus GPS • HR Payroll • WhatsApp & Admin Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTenant('dps')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTenant === 'dps' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                DPS
              </button>
              <button 
                onClick={() => setActiveTenant('greenwood')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTenant === 'greenwood' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                Greenwood
              </button>
            </div>
            <Link href="/dashboard" className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors">
              <Layers className="w-4 h-4 text-cyan-400" /> Master Hub
            </Link>
          </div>
        </div>

        {/* Quick Operations Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono">Active CRM Leads</span>
              <div className="text-2xl font-bold text-cyan-400">{leads.length}</div>
            </div>
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono">Student Attendance</span>
              <div className="text-2xl font-bold text-emerald-400">95.4%</div>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono">Fee Collection</span>
              <div className="text-2xl font-bold text-indigo-400">75%</div>
            </div>
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono">Bus Fleet GPS</span>
              <div className="text-2xl font-bold text-purple-400">3 Routes</div>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
              <Bus className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono">HR Payroll</span>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Processed
              </div>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* SECTION 1: Admissions CRM Pipeline */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-base">Admissions CRM • Lead & Inquiry Pipeline</h3>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              Pipeline Management & Follow-ups
            </span>
          </div>

          {/* Add Lead Form */}
          <form onSubmit={handleAddLead} className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <input 
              type="text" 
              value={leadName} 
              onChange={e => setLeadName(e.target.value)} 
              placeholder="Student Name"
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <input 
              type="text" 
              value={parentName} 
              onChange={e => setParentName(e.target.value)} 
              placeholder="Parent Name"
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <input 
              type="text" 
              value={leadPhone} 
              onChange={e => setLeadPhone(e.target.value)} 
              placeholder="Phone Number"
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <select 
              value={leadGrade} 
              onChange={e => setLeadGrade(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option>Grade 9</option>
              <option>Grade 10</option>
              <option>Grade 11</option>
              <option>Grade 12</option>
            </select>
            <button 
              type="submit" 
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs py-2 flex items-center justify-center gap-1 shadow-md shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" /> Add Lead
            </button>
          </form>

          {/* Leads Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">Student / Parent</th>
                  <th className="pb-2">Contact</th>
                  <th className="pb-2">Grade</th>
                  <th className="pb-2">Status Stage</th>
                  <th className="pb-2">Inquiry Date</th>
                  <th className="pb-2 text-right">Update Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-850">
                    <td className="py-3">
                      <div className="font-semibold text-slate-200">{lead.student}</div>
                      <div className="text-slate-400 text-[10px]">Parent: {lead.parent}</div>
                    </td>
                    <td className="py-3 text-slate-300 flex items-center gap-1.5 pt-4">
                      <PhoneCall className="w-3.5 h-3.5 text-cyan-400" /> {lead.phone}
                    </td>
                    <td className="py-3 text-slate-300">{lead.grade}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        lead.status === 'Enrolled' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        lead.status === 'Campus Tour' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                        lead.status === 'Application Submitted' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{lead.date}</td>
                    <td className="py-3 text-right">
                      <select 
                        value={lead.status} 
                        onChange={e => updateLeadStatus(lead.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-cyan-500"
                      >
                        <option value="New Inquiry">New Inquiry</option>
                        <option value="Campus Tour">Campus Tour</option>
                        <option value="Application Submitted">Application Submitted</option>
                        <option value="Enrolled">Enrolled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: Attendance Tracking (Student & Teacher) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Student Attendance Overview */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Student Attendance Overview
              </h3>
              <span className="text-xs font-mono text-slate-400">Daily Log</span>
            </div>

            <div className="space-y-2.5">
              {studentAttendance.map((item) => (
                <div key={item.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{item.grade}</div>
                    <div className="text-slate-400">Total Enrolled: {item.total} | Present: <span className="text-emerald-400">{item.present}</span> | Absent: <span className="text-red-400">{item.absent}</span></div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-[10px] font-bold">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Attendance & Toggle */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Teacher Attendance & Status
              </h3>
              <span className="text-xs font-mono text-slate-400">Click to toggle status</span>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {teachers.map(t => (
                <div key={t.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{t.subject}</div>
                  </div>
                  <button 
                    onClick={() => toggleTeacherAttendance(t.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      t.status === 'Present' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' :
                      t.status === 'Absent' ? 'bg-red-500/10 border border-red-500/30 text-red-400' :
                      'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    }`}
                  >
                    {t.status}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SECTION 3: Fee Payment & Bill Print Management */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              Fee Payment & Bill Print Management
            </h3>
            <span className="text-xs font-mono text-slate-400">Secure Gateway Integration</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">Student Name</th>
                  <th className="pb-2">Roll No</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Due / Paid Date</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {fees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-850">
                    <td className="py-3 font-semibold text-slate-200">{fee.student}</td>
                    <td className="py-3 text-slate-400">{fee.roll}</td>
                    <td className="py-3 font-bold text-white">{fee.amount}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        fee.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        fee.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{fee.date}</td>
                    <td className="py-3 text-right space-x-2">
                      {fee.status !== 'Paid' && (
                        <button 
                          onClick={() => markFeePaid(fee.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold transition-all"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button 
                        onClick={() => printBill(fee.student)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded text-[10px] font-bold transition-all inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" /> Bill Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 4: Bus Fleet Tracking & HR Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Bus Fleet & GPS Tracking */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Bus className="w-5 h-5 text-indigo-400" />
                Bus Fleet & GPS Live Telemetry
              </h3>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Live Tracking
              </span>
            </div>

            <div className="space-y-3">
              {buses.map((bus) => (
                <div key={bus.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{bus.route}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      bus.status === 'On Time' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      bus.status.includes('Delayed') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {bus.status}
                    </span>
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>Bus No: <strong className="text-slate-200">{bus.busNo}</strong> | Driver: {bus.driver}</span>
                  </div>
                  <div className="text-cyan-400 text-[11px] flex items-center gap-1 pt-1">
                    <MapPin className="w-3.5 h-3.5" /> {bus.gps}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HR Activities & Payroll */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                HR Activities & Staff Payroll
              </h3>
              <span className="text-xs font-mono text-slate-400">{hrStaff.length} Employees</span>
            </div>

            <form onSubmit={handleAddStaff} className="flex gap-2">
              <input 
                type="text" 
                value={newStaffName} 
                onChange={e => setNewStaffName(e.target.value)} 
                placeholder="Staff Name..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <input 
                type="text" 
                value={newStaffRole} 
                onChange={e => setNewStaffRole(e.target.value)} 
                placeholder="Role / Title..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button 
                type="submit" 
                className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>

            <div className="space-y-2.5 max-h-48 overflow-y-auto">
              {hrStaff.map(staff => (
                <div key={staff.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="font-bold text-slate-200">{staff.name}</div>
                    <div className="text-slate-400">{staff.role} • <span className="text-slate-300">Leaves: {staff.leaveBalance}</span></div>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    staff.payrollStatus.includes('Processed') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {staff.payrollStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SECTION 5: WhatsApp Communication & Admin Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* WhatsApp Communication Hub */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                WhatsApp Communication Gateway
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Meta Cloud API
              </span>
            </div>

            <form onSubmit={sendWhatsAppBroadcast} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono">Recipient Group</label>
                <select 
                  value={waRecipient} 
                  onChange={e => setWaRecipient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option>All Prospective Parents & Staff</option>
                  <option>Campus Tour Scheduled Only</option>
                  <option>Bus Route Subscribers Only</option>
                  <option>Fee Defaulters Broadcast</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono">Message Template</label>
                <textarea 
                  rows={3} 
                  value={waMessage} 
                  onChange={e => setWaMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-emerald-400">{waStatus}</span>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                >
                  <Send className="w-3.5 h-3.5" /> Broadcast WhatsApp
                </button>
              </div>
            </form>
          </div>

          {/* Admin Activities Control Center */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                Admin Activities & Audit Log
              </h3>
              <span className="text-xs font-mono text-slate-400">{adminLogs.length} Events Logged</span>
            </div>

            <form onSubmit={logAdminAction} className="flex gap-2">
              <input 
                type="text" 
                value={newLogAction} 
                onChange={e => setNewLogAction(e.target.value)} 
                placeholder="Log manual administrative action..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button 
                type="submit" 
                className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Log
              </button>
            </form>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {adminLogs.map((log, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span className="text-slate-200">{log.action}</span>
                    <span className="text-slate-500">({log.admin})</span>
                  </div>
                  <span className="text-slate-400">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SECTION 6: AI Co-Pilot & ESG Audit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* SmartCampus AI Co-Pilot */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  SmartCampus AI Co-Pilot
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  DPS Bound
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 h-40 overflow-y-auto space-y-3 text-xs font-mono">
                {messages.map((m, idx) => (
                  <div key={idx} className={`p-2.5 rounded-xl max-w-[85%] ${m.sender === 'user' ? 'bg-cyan-500/10 text-cyan-200 ml-auto border border-cyan-500/20' : 'bg-slate-900 text-slate-300 mr-auto border border-slate-800'}`}>
                    {m.text}
                  </div>
                ))}
                {isAiThinking && (
                  <div className="p-2.5 bg-slate-900 text-slate-400 rounded-xl max-w-[85%] mr-auto italic">
                    Analyzing CRM leads, attendance, bus GPS & payroll databases...
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 mt-3 border-t border-slate-800">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about CRM leads, attendance, bus GPS, or HR payroll..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </form>
          </div>

          {/* AI Sustainability & Campus ESG Audit */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-emerald-400" />
                  AI Sustainability & Campus ESG Audit
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Compliance Ready
                </span>
              </div>

              <p className="text-slate-400 text-xs">
                Automated compliance, carbon footprint, and resource intelligence for Delhi Public School. Current Status: <strong className="text-emerald-400">{esgStatus}</strong>
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800">
              <button
                onClick={runEsgAudit}
                disabled={isAuditing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAuditing ? 'Running Compliance Audit...' : 'Run Live ESG Audit'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
