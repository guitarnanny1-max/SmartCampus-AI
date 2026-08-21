export const revalidate = 0;
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET(req: any): Promise<NextResponse> {
  const encoder = new TextEncoder();

  const customStream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const data = JSON.stringify({
          timestamp: new Date().toISOString(),
          solarOutput: (Math.random() * 20 + 35).toFixed(1) + ' kW',
          gridLoad: (Math.random() * 15 + 110).toFixed(1) + ' kW',
          temperature: (Math.random() * 2 + 21).toFixed(1) + '°C',
        });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }, 3000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new NextResponse(customStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
