import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SmartCampus SaaS OS database...');

  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'apex-academy' },
    update: {},
    create: {
      name: 'Apex International Academy',
      subdomain: 'apex-academy',
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
    },
  });

  console.log(`Tenant created/verified: ${tenant.name} (${tenant.id})`);

  // Seed sample student
  await prisma.student.createMany({
    data: [
      { tenantId: tenant.id, rollNo: 'APP-2026-01', name: 'Aarav Sharma', grade: 'Grade 12-A', attendance: 98.5, feeStatus: 'Paid' },
      { tenantId: tenant.id, rollNo: 'APP-2026-02', name: 'Diya Patel', grade: 'Grade 12-B', attendance: 96.0, feeStatus: 'Paid' },
    ],
    skipDuplicates: true,
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
