export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WhatsappHubPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipientPhone, setRecipientPhone] = useState('+91');
  const [recipientName, setRecipientName] = useState('');
  const [templateName, setTemplateName] = useState('FEE_DUE_REMINDER');
  const [messageBody, setMessageBody] = useState('Dear Parent/Student, your campus fee payment is pending. Please complete the transaction via UPI or NetBanking.');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/whatsapp/history')
      .then(res => res.json())
      .then(data => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleTemplateChange = (tmpl: string) => {
    setTemplateName(tmpl);
    if (tmpl === 'FEE_DUE_REMINDER') {
      setMessageBody('Dear Parent, your semester fee installment is due this week. Please pay securely via UPI/Cards in your portal.');
    } else if (tmpl === 'EXAM_SCHEDULE_ALERT') {
      setMessageBody('Notice: Semester examination timetables and hall tickets are now available for download on the student dashboard.');
    } else if (tmpl === 'EMERGENCY_SECURITY_NOTICE') {
      setMessageBody('URGENT SECURITY ALERT: Campus perimeter lockdown drill will commence at 3:00 PM today. Please follow staff instructions.');
    } else {
      setMessageBody('Hello from AI Campus Enterprise Hub. Please check your portal for important campus updates.');
    }
  };

  const handleSendWhatsapp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientPhone, recipientName, templateName, messageBody }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch message');

      setLogs([data.log, ...logs]);
      setRecipientPhone('+91');
      setRecipientName('');
      alert('WhatsApp message dispatched successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                WHATSAPP BUSINESS API INTEGRATION
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus WhatsApp Messaging Hub</h1>
            <p className="text-xs text-slate-400">Broadcast automated fee reminders, exam schedules, and emergency alerts directly to WhatsApp.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSendWhatsapp} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>💬</span> Send Broadcast / Notification via WhatsApp
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Recipient Phone (with country code)</label>
              <input 
                type="text" 
                placeholder="+919876543210" 
                value={recipientPhone} 
                onChange={e => setRecipientPhone(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Recipient Name / Role</label>
              <input 
                type="text" 
                placeholder="e.g. Aarav Sharma (Parent)" 
                value={recipientName} 
                onChange={e => setRecipientName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Message Template</label>
              <select 
                value={templateName} 
                onChange={e => handleTemplateChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="FEE_DUE_REMINDER">Fee Due Reminder</option>
                <option value="EXAM_SCHEDULE_ALERT">Exam Schedule Alert</option>
                <option value="EMERGENCY_SECURITY_NOTICE">Emergency Security Notice</option>
                <option value="CUSTOM_BROADCAST">Custom Broadcast</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400">Message Body</label>
            <textarea 
              rows={3}
              value={messageBody} 
              onChange={e => setMessageBody(e.target.value)} 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:border-emerald-500 focus:outline-none" 
            />
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={sending} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <span>{sending ? 'Sending WhatsApp...' : 'Dispatch WhatsApp Message →'}</span>
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📜</span> WhatsApp Dispatch Logs ({logs.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Recipient & Phone</th>
                  <th className="p-4 font-medium">Template / Message</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l: any) => (
                  <tr key={l.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{l.recipientName}</p>
                      <p className="text-[10px] text-emerald-400">{l.recipientPhone}</p>
                    </td>
                    <td className="p-4 space-y-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {l.templateName}
                      </span>
                      <p className="text-[11px] text-slate-300">{l.messageBody}</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No WhatsApp dispatch logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
