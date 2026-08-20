'use client';

import React, { useState } from 'react';
import { 
  Utensils, 
  Coffee, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingBag, 
  Calendar,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function CafeteriaPortal() {
  const [balance, setBalance] = useState(450);
  const [menu] = useState([
    { id: 1, name: 'Paneer Tikka Wrap & Fresh Juice', category: 'Lunch', price: 120, status: 'Available' },
    { id: 2, name: 'Mediterranean Grain Bowl', category: 'Lunch', price: 150, status: 'Available' },
    { id: 3, name: 'Cold Brew & Artisan Bakery Muffin', category: 'Breakfast', price: 80, status: 'Available' },
    { id: 4, name: 'Classic Garden Salad with Grilled Chicken', category: 'Lunch', price: 140, status: 'Low Stock' },
  ]);

  const [orders, setOrders] = useState([
    { id: 'ORD-902', item: 'Mediterranean Grain Bowl', time: '12:15 PM', status: 'Ready' },
    { id: 'ORD-911', item: 'Cold Brew & Muffin', time: '8:30 AM', status: 'Collected' }
  ]);

  const orderItem = (item: any) => {
    if (balance >= item.price) {
      setBalance(balance - item.price);
      setOrders([
        { id: `ORD-${Math.floor(100 + Math.random() * 900)}`, item: item.name, time: 'Just now', status: 'Preparing' },
        ...orders
      ]);
    } else {
      alert('Insufficient wallet balance. Please top up.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono rounded-full uppercase">
                Portal: Cafeteria & Nutrition Hub
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">Campus Dining & Meal Plan 🥗</h1>
            <p className="text-slate-400 text-sm">Delhi Public School • Cashless Dining & Pre-orders</p>
          </div>
          <div className="flex gap-3">
             <Link href="/dashboard" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-colors">
                Master Hub
             </Link>
          </div>
        </div>

        {/* Wallet & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono">Digital Meal Wallet</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-400">₹{balance}.00</h3>
            </div>
            <button 
              onClick={() => setBalance(balance + 500)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-emerald-900/20"
            >
              + Top Up ₹500
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono">Active Orders</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{orders.filter(o => o.status !== 'Collected').length}</h3>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono">Today's Kitchen Status</p>
              <h3 className="text-2xl font-bold mt-1 text-cyan-400">Operational</h3>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Utensils className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Menu Catalog */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Today's Menu & Pre-Orders
            </h2>
            <div className="space-y-3">
              {menu.map((item) => (
                <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-indigo-400">{item.category}</span>
                      <span className="text-[10px] text-slate-500">•</span>
                      <span className="text-xs text-slate-400 font-semibold">₹{item.price}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-200 mt-1">{item.name}</h3>
                  </div>
                  <button 
                    onClick={() => orderItem(item)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-all"
                  >
                    Order Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Feed */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Live Order Tracking
              </h2>
              <div className="space-y-3">
                {orders.map((order, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-mono text-slate-500">{order.id} • {order.time}</div>
                      <div className="text-xs font-semibold text-slate-200 mt-0.5">{order.item}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      order.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      order.status === 'Preparing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/20 p-6 rounded-2xl">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Nutritional Guarantee
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                All meals are prepared fresh daily using locally sourced organic ingredients under strict certified institutional hygiene standards.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
