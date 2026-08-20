'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartIdCardPrintPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/smart-id-card')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8 print:p-0 print:bg-white print:text-black">
      <div className="max-w-5xl mx-auto space-y-8 print:max-w-none print:space-y-4">
        {/* Header - Hidden during print */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl print:hidden">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                SMARTCAMPUS AI ID CARD PRINT HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">CR80 Badge Batch Print Studio</h1>
            <p className="text-xs text-slate-400">Generate camera-ready, printable institutional ID cards formatted for standard PVC badge printers.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <span>🖨️</span> Print All ID Badges
            </button>
            <Link 
              href="/smart-id-card" 
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              ← Back to ID Manager
            </Link>
          </div>
        </div>

        {/* Print Instructions */}
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-4 text-xs text-cyan-300 print:hidden flex items-center justify-between">
          <p>💡 <strong>Tip:</strong> Set your print scale to 100% and enable background graphics in your browser print settings for accurate badge proportions.</p>
          <span className="font-mono font-bold">{records.length} Badges Ready</span>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
          {records.map((r) => (
            <div 
              key={r.id} 
              className="w-full max-w-[400px] h-[250px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-cyan-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between print:border-slate-400 print:bg-white print:text-black print:shadow-none mx-auto"
            >
              {/* Background watermark effect */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none print:hidden"></div>

              {/* Card Header */}
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-3 print:border-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-extrabold text-xs print:bg-black print:text-white">
                    SC
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide uppercase print:text-black">SmartCampus Institute</h4>
                    <p className="text-[9px] text-slate-400 print:text-slate-600">Official Institutional ID</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 print:border-black print:text-black">
                  {r.role}
                </span>
              </div>

              {/* Card Body */}
              <div className="flex items-center gap-4 my-auto">
                <div className="w-16 h-20 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-[10px] font-mono shrink-0 print:bg-slate-200 print:border-slate-400 print:text-slate-700">
                  PHOTO
                </div>
                <div className="space-y-1 overflow-hidden">
                  <h3 className="text-sm font-extrabold text-white truncate print:text-black">{r.cardholderName}</h3>
                  <p className="text-[11px] text-cyan-300 font-medium truncate print:text-slate-800">{r.department}</p>
                  <p className="text-[10px] text-slate-400 font-mono print:text-slate-600">ID: {r.rollOrEmpId}</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex justify-between items-end text-[10px] print:border-slate-300">
                <div>
                  <p className="text-slate-500 print:text-slate-600">Valid Thru</p>
                  <p className="text-slate-200 font-mono font-bold print:text-black">{r.validThru}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 print:text-slate-600">Security Access</p>
                  <p className="text-emerald-400 font-mono font-bold print:text-black">ENABLED (RFID)</p>
                </div>
              </div>
            </div>
          ))}

          {records.length === 0 && !loading && (
            <div className="col-span-2 p-12 text-center text-slate-500 bg-slate-900/30 border border-slate-800 rounded-2xl">
              No ID cards found to print. Please generate ID cards first.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
