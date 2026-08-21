import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Initiating Automated Enterprise Backup Snapshots...");

  const tenants = await prisma.tenant.findMany({
    include: { students: true, invoices: true, auditLogs: true, announcements: true, alerts: true, energyLogs: true, exams: true, libraryAssets: true, staff: true }
  });

  const backupDir = path.join(process.cwd(), "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  for (const tenant of tenants) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${tenant.subdomain}-${timestamp}.json`;
    const filepath = path.join(backupDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(tenant, null, 2));
    console.log(`✅ Backed up workspace: ${tenant.name} (${tenant.subdomain}) -> ${filename}`);
  }

  console.log(`✨ Backup complete! Total tenants backed up: ${tenants.length}`);
}

main()
  .catch((e) => {
    console.error("Backup failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
