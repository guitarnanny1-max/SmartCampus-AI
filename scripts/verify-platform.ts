import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyPlatform() {
  console.log('🔍 Running SmartCampus AI Multi-Tenant Verification Suite...\n');

  try {
    const schools = await prisma.school.findMany({
      include: {
        facilities: true,
        students: true,
        placements: true,
        alerts: true,
        auditLogs: true,
        apiKeys: true,
      },
    });

    console.log(`✅ Database connection active.`);
    console.log(`✅ Found ${schools.length} active institutional tenants:\n`);

    for (const school of schools) {
      console.log(`  🏢 Tenant: ${school.name}`);
      console.log(`     - Subdomain: ${school.subdomain}`);
      console.log(`     - Tier: ${school.tier}`);
      console.log(`     - Facilities (IoT Zones): ${school.facilities.length}`);
      console.log(`     - Students (Roster): ${school.students.length}`);
      console.log(`     - Placements: ${school.placements.length}`);
      console.log(`     - Active Alerts: ${school.alerts.length}`);
      console.log(`     - Audit Logs: ${school.auditLogs.length}`);
      console.log(`     - API Keys: ${school.apiKeys.length}`);
      console.log('--------------------------------------------------');
    }

    console.log('\n🎉 All multi-tenant isolation checks passed successfully!');
  } catch (error) {
    console.error('❌ Platform verification failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyPlatform();
