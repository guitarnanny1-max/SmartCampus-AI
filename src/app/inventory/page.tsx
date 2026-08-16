'use client';

import React, { useState } from 'react';
import { Sparkles, Package, ShoppingCart, ArrowLeft, CheckCircle2, Search, ShieldCheck, ClipboardList, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function InventoryModule() {
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const inventoryList = [
    { id: 'INV-501', item: 'Dell UltraSharp 27 4K Monitors', category: 'IT Hardware', stock: '142 units', status: 'In Stock', vendor: 'Dell Enterprise India', reorderLevel: '20 units' },
    { id: 'INV-502', item: 'Oscilloscope 100MHz Digital', category: 'Physics Lab', stock: '28 units', status: 'Adequate', vendor: 'Tektronix Labs', reorderLevel: '5 units' },
    { id: 'INV-503', item: 'Biometric Facial Scanner Terminal', category: 'Security Hardware', stock: '4 units', status: 'Low Stock', vendor: 'Suprema Access', reorderLevel: '10 units' },
    { id: 'INV-504', item: 'Catalyst 9300 Enterprise Switch', category: 'Networking', stock: '12 units', status: 'Adequate', vendor: 'Cisco Systems', reorderLevel: '3 units' },
  ];

  const handleCreateOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 3500);
  };

  const filteredInventory = inventoryList.filter(item => 
    item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus SaaS OS</h1>
            <span className="text-[10px] text-slate-400">Inventory & Procurement Hub</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Inventory & Procurement Management</h2>
            <p className="text-xs text-slate-400 mt-1">Track laboratory equipment, IT assets, purchase orders, and automated vendor reorder thresholds.</p>
          </div>
          <button
            onClick={handleCreateOrder}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Create Purchase Order</span>
          </button>
        </div>

        {orderSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Purchase order successfully generated and transmitted to authorized vendor portal for fulfillment.</span>
          </div>
        )}

        {/* Inventory KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Total Tracked Assets</div>
            <div className="text-3xl font-extrabold text-white">8,450 Items</div>
            <div className="text-[10px] text-cyan-400 font-medium">Barcode & RFID tagged</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Active Purchase Orders</div>
            <div className="text-3xl font-extrabold text-emerald-400">14 Orders</div>
            <div className="text-[10px] text-slate-400">Out for vendor delivery</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Low Stock Alerts</div>
            <div className="text-3xl font-extrabold text-amber-400">3 Items</div>
            <div className="text-[10px] text-slate-400">Requires immediate restock</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Procurement Budget Usage</div>
            <div className="text-3xl font-extrabold text-cyan-400">₹42.5 Lakhs</div>
            <div className="text-[10px] text-slate-400">Within annual fiscal allocation</div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-400" />
              <span>Asset Stock & Vendor Ledger</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search item, category, vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredInventory.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.item} • <span className="text-cyan-400 font-mono">{item.id}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Category: <strong className="text-slate-300">{item.category}</strong></span>
                    <span>Vendor: <strong className="text-slate-300">{item.vendor}</strong></span>
                    <span>Stock: <strong className="text-slate-300">{item.stock}</strong></span>
                    <span>Reorder Level: <strong className="text-slate-300">{item.reorderLevel}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    item.status === 'In Stock' || item.status === 'Adequate' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.status}
                  </span>
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-400 font-medium transition-colors cursor-pointer">
                    Manage Asset
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus SaaS OS • Enterprise Inventory & Procurement Management</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Powered by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
