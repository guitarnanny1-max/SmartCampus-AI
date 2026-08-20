import { getCurrentSchool } from '@/lib/current-school';
import { prisma } from '@/lib/prisma';
import AiAssistant from '@/components/AiAssistant';
import AddRecordModal from '@/components/AddRecordModal';
import AiSustainabilityAudit from '@/components/AiSustainabilityAudit';
import EnergyChart from '@/components/EnergyChart';
import TenantBilling from '@/components/TenantBilling';
import ExportReports from '@/components/ExportReports';
import AuditLogViewer from '@/components/AuditLogViewer';
import WebhookViewer from '@/components/WebhookViewer';
import LiveTelemetryStream from '@/components/LiveTelemetryStream';

export default async function DashboardPage() {
  const school = await getCurrentSchool();

  const [facilities, students, placements, alerts, auditLogs, webhookLogs] = await Promise.all([
    prisma.facility.findMany({ where: { schoolId: school.id } }),
    prisma.student.findMany({ where: { schoolId: school.id } }),
    prisma.placement.findMany({ where: { schoolId: school.id } }),
    prisma.alert.findMany({ where: { schoolId: school.id }, orderBy: { createdAt: 'desc' } }),
    prisma.auditLog.findMany({ where: { schoolId: school.id }, orderBy: { createdAt: 'desc' } }),
    prisma.webhookLog.findMany({ where: { schoolId: school.id }, orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <div className="space-y-8">
      {/* Hero Tenant Banner */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Campus Operations & Analytics</h2>
          <p className="text-sm text-slate-400">
            Isolated tenant view for <strong className="text-cyan-400">{school.name}</strong> (Subdomain: <code className="text-cyan-300 font-mono">{school.subdomain}</code>)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 block">Facilities</span>
              <span className="text-white font-bold text-sm">{facilities.length}</span>
            </div>
            <div className="border-r border-slate-800"></div>
            <div>
              <span className="text-slate-500 block">Students</span>
              <span className="text-white font-bold text-sm">{students.length}</span>
            </div>
            <div className="border-r border-slate-800"></div>
            <div>
              <span className="text-slate-500 block">Alerts</span>
              <span className="text-white font-bold text-sm">{alerts.length}</span>
            </div>
          </div>
          <ExportReports />
          <AddRecordModal />
        </div>
      </div>

      {/* Live IoT Sensor Telemetry Stream */}
      <LiveTelemetryStream />

      {/* Tenant Billing & Metering */}
      <TenantBilling 
        schoolName={school.name} 
        tier={(school as any).subscriptionTier} 
        currentStudents={students.length} 
        maxStudents={(school as any).maxStudents} 
      />

      {/* Energy Telemetry Chart */}
      <EnergyChart schoolName={school.name} />

      {/* Incident & Alert Center */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>🚨</span> Campus Incident & Alert Center
        </h3>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-white text-sm">{alert.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    alert.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                    alert.severity === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                    'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{alert.message}</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="py-6 text-center text-slate-500 text-xs">
              No active security or operational alerts for this tenant.
            </div>
          )}
        </div>
      </div>

      {/* Audit Log Viewer */}
      <AuditLogViewer logs={auditLogs.map((l: any) => ({ ...l, actor: l.actor || 'System', details: l.details || '' }))} />

      {/* Webhook Event Dispatch Viewer */}
      <WebhookViewer logs={webhookLogs.map((l: any) => ({
        id: l.id,
        event: l.event || l.status || 'WEBHOOK_DISPATCH',
        targetUrl: l.targetUrl || l.endpoint || '',
        statusCode: typeof l.statusCode === 'number' ? l.statusCode : 200,
        payload: l.payload || '',
        createdAt: l.createdAt
      }))} />

      {/* AI Sustainability Audit Section */}
      <AiSustainabilityAudit 
        schoolName={school.name} 
        facilitiesCount={facilities.length} 
        studentsCount={students.length} 
      />

      {/* AI Assistant Section */}
      <AiAssistant schoolName={school.name} />

      {/* Facilities Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white tracking-wide">Facility & Energy Telemetry</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <div key={facility.id} className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-cyan-500/40 transition-all">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-white">{facility.zoneName}</h4>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {facility.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Solar Generation:</span>
                  <span className="font-mono text-cyan-400">{facility.solar}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">HVAC Control:</span>
                  <span className="font-mono">{facility.hvac}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Students Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white tracking-wide">Student Academic Roster</h3>
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Roll No</th>
                  <th className="p-4 font-medium">CGPA</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-slate-800/60 hover:bg-slate-900/30 transition-colors">
                    <td className="p-4 text-white font-medium">{student.name}</td>
                    <td className="p-4 font-mono text-slate-400">{student.rollNo}</td>
                    <td className="p-4 font-mono text-cyan-400 font-semibold">{student.cgpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Placements Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white tracking-wide">Career & Placement Center</h3>
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Package / CTC</th>
                </tr>
              </thead>
              <tbody>
                {placements.map((placement) => (
                  <tr key={placement.id} className="border-b border-slate-800/60 hover:bg-slate-900/30 transition-colors">
                    <td className="p-4 text-white font-medium">{placement.company}</td>
                    <td className="p-4 text-slate-300">{placement.role}</td>
                    <td className="p-4 font-mono text-emerald-400 font-semibold">{placement.ctc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
