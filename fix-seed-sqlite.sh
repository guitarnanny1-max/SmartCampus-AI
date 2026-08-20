#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Updating Seeder for SQLite Compatibility"
echo "=================================================="

cat << 'JAVASCRIPT' > prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with production mock data...');

  const dps = await prisma.school.upsert({
    where: { subdomain: 'dps' },
    update: {},
    create: {
      name: 'Delhi Public School',
      subdomain: 'dps',
      code: 'DPS001',
      email: 'admin@dps.edu',
    },
  });

  const greenwood = await prisma.school.upsert({
    where: { subdomain: 'greenwood' },
    update: {},
    create: {
      name: 'Greenwood High',
      subdomain: 'greenwood',
      code: 'GWH002',
      email: 'admin@greenwood.edu',
    },
  });

  // Clean existing records for clean seeding
  await prisma.facility.deleteMany({ where: { schoolId: dps.id } });
  await prisma.student.deleteMany({ where: { schoolId: dps.id } });
  await prisma.placement.deleteMany({ where: { schoolId: dps.id } });
  await prisma.alert.deleteMany({ where: { schoolId: dps.id } });
  await prisma.auditLog.deleteMany({ where: { schoolId: dps.id } });
  await prisma.webhookLog.deleteMany({ where: { schoolId: dps.id } });
  await prisma.apiKey.deleteMany({ where: { schoolId: dps.id } });

  await prisma.facility.createMany({
    data: [
      { schoolId: dps.id, name: 'Main Auditorium', type: 'Assembly', status: 'ACTIVE' },
      { schoolId: dps.id, name: 'Science Block Lab 3', type: 'Laboratory', status: 'ACTIVE' },
      { schoolId: dps.id, name: 'Indoor Sports Complex', type: 'Sports', status: 'ACTIVE' },
      { schoolId: dps.id, name: 'Central Library', type: 'Academic', status: 'ACTIVE' },
    ],
  });

  await prisma.student.createMany({
    data: [
      { schoolId: dps.id, name: 'Aarav Sharma', email: 'aarav.sharma@dps.edu', status: 'ACTIVE' },
      { schoolId: dps.id, name: 'Diya Patel', email: 'diya.patel@dps.edu', status: 'ACTIVE' },
      { schoolId: dps.id, name: 'Kabir Mehta', email: 'kabir.mehta@dps.edu', status: 'ACTIVE' },
      { schoolId: dps.id, name: 'Ananya Iyer', email: 'ananya.iyer@dps.edu', status: 'ACTIVE' },
      { schoolId: dps.id, name: 'Rohan Verma', email: 'rohan.verma@dps.edu', status: 'ACTIVE' },
    ],
  });

  await prisma.placement.createMany({
    data: [
      { schoolId: dps.id, company: 'Google', role: 'Software Engineering Intern', package: 24.5 },
      { schoolId: dps.id, company: 'Microsoft', role: 'Cloud Developer', package: 28.0 },
      { schoolId: dps.id, company: 'Goldman Sachs', role: 'Analyst', package: 22.0 },
    ],
  });

  await prisma.alert.createMany({
    data: [
      { schoolId: dps.id, title: 'HVAC Maintenance Scheduled', message: 'Routine filter replacement in Science Block.', severity: 'INFO' },
      { schoolId: dps.id, title: 'Solar Grid Peak Output', message: 'Solar array operating at 105% efficiency.', severity: 'SUCCESS' },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      { schoolId: dps.id, action: 'SETTINGS_UPDATE', details: 'Updated tenant branding configuration' },
      { schoolId: dps.id, action: 'STUDENT_IMPORT', details: 'Imported batch of 50 student records' },
    ],
  });

  await prisma.webhookLog.createMany({
    data: [
      { schoolId: dps.id, endpoint: 'https://api.dps.edu/webhooks/telemetry', payload: '{"status": "sync_ok"}', status: 'SUCCESS' },
    ],
  });

  await prisma.apiKey.createMany({
    data: [
      { schoolId: dps.id, name: 'Production IoT Gateway Key', key: 'sk_live_dps_9f873b2a1c' },
    ],
  });

  console.log('✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
JAVASCRIPT

echo "[1/2] Running database seed..."
npx prisma db seed

echo "[2/2] Starting Next.js Development Server..."
npm run dev
