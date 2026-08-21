import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const challenge = Buffer.from(Math.random().toString()).toString("base64");
    const options = {
      challenge,
      rp: { name: "Smart Campus AI", id: "localhost" },
      user: {
        id: Buffer.from(email).toString("base64"),
        name: email,
        displayName: email,
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
      timeout: 60000,
      attestation: "direct",
    };
    return NextResponse.json(options);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate challenge" }, { status: 500 });
  }
}
