import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function requirePlatformAdmin() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;

  if (!sessionId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
      isPlatformUser: true,
      authVersion: true,
    },
  });

  if (
    !user ||
    user.role !== "SUPER_ADMIN" ||
    user.isPlatformUser !== true ||
    user.authVersion !== 2
  ) {
    return null;
  }

  return user;
}
