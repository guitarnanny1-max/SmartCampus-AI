import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const data = JSON.stringify({
          solar: (40 + Math.random() * 5).toFixed(1),
          gridLoad: (120 + Math.random() * 10).toFixed(1),
          hvacTemp: (22 + Math.random() * 0.8).toFixed(1),
          timestamp: new Date().toISOString(),
        });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }, 3000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
