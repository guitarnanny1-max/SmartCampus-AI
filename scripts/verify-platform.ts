import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Verifying platform state...");

  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        students: true,
        invoices: true,
        auditLogs: true,
        announcements: true,
        alerts: true,
        energyLogs: true,
        exams: true,
        libraryAssets: true,
        staff: true
      }
    });

    console.log(`✅ Platform verification successful! Found ${tenants.length} active tenant workspaces.`);
  } catch (error) {
    console.error("❌ Platform verification failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
