import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, credential } = await req.json();
    await (prisma as any).user.update({
      where: { email },
      data: {
        biometricCredentialId: credential.id,
        biometricPublicKey: credential.response.attestationObject,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to verify credential" }, { status: 500 });
  }
}
