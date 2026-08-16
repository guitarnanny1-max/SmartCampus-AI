import { NextResponse } from 'next/server';

export async function GET() {
  const telemetryData = {
    system: "SmartCampus SaaS OS",
    status: "Operational",
    version: "2.6.0",
    activeTenants: 3,
    globalStats: {
      totalStudents: 1380,
      totalStaff: 124,
      monthlyRevenue: "₹2.12 Cr",
      uptime: "99.99%"
    },
    modules: [
      "hostel", "timetable", "exams", "library", "messaging", 
      "hr", "visitors", "transport", "inventory", "alumni", "analytics"
    ],
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(telemetryData, { status: 200 });
}
