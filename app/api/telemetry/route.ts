import { NextResponse } from "next/server";

export async function GET() {
  try {
    const solarGen = (Math.random() * 15 + 35).toFixed(2); // ~35-50 kW
    const gridLoad = (Math.random() * 20 + 60).toFixed(2); // ~60-80 kW
    const batteryLevel = (Math.random() * 5 + 85).toFixed(1); // ~85-90%

    return NextResponse.json({
      solarGen: parseFloat(solarGen),
      gridLoad: parseFloat(gridLoad),
      batteryLevel: parseFloat(batteryLevel),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return NextResponse.json({ error: "Telemetry error" }, { status: 500 });
  }
}
