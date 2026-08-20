#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Polishing Dashboard Schema, Seeder & UI Render"
echo "=================================================="

mkdir -p prisma src/app

echo "[1/4] Updating Prisma Schema with Student rollNo & cgpa..."
cat << 'SCHEMA' > prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model School {
  id                 String       @id @default(uuid())
  name               String
  code               String?      @unique
  subdomain          String?      @unique
  email              String?
  tier               String       @default("ENTERPRISE") // FREE, PRO, ENTERPRISE
  maxStudents        Int          @default(1000)
  stripeCustomerId   String?      @unique
  stripeSubscription String?      @unique
  stripeStatus       String       @default("ACTIVE")
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt
  facilities         Facility[]
  students           Student[]
  placements         Placement[]
  alerts             Alert[]
  auditLogs          AuditLog[]
  webhookLogs        WebhookLog[]
  apiKeys            ApiKey[]
}

model Facility {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name        String
  type        String
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Student {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name        String
  rollNo      String?
  cgpa        Float?
  email       String?  @unique
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Placement {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  company     String
  role        String
  package     Float?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Alert {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title       String
  message     String
  severity    String   @default("INFO")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model AuditLog {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  action      String
  details     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model WebhookLog {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  endpoint    String
  payload     String?
  status      String   @default("SUCCESS")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ApiKey {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name        String
  key         String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
SCHEMA

echo "[2/4] Updating Seeder with Student Roll Numbers & CGPA..."
cat << 'JAVASCRIPT' > prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with enriched student records...');

  const dps = await prisma.school.upsert({
    where: { subdomain: 'dps' },
    update: { tier: 'ENTERPRISE', maxStudents: 1000 },
    create: {
      name: 'Delhi Public School',
      subdomain: 'dps',
      code: 'DPS001',
      email: 'admin@dps.edu',
      tier: 'ENTERPRISE',
      maxStudents: 1000,
    },
  });

  const greenwood = await prisma.school.upsert({
    where: { subdomain: 'greenwood' },
    update: { tier: 'PRO', maxStudents: 250 },
    create: {
      name: 'Greenwood High',
      subdomain: 'greenwood',
      code: 'GWH002',
      email: 'admin@greenwood.edu',
      tier: 'PRO',
      maxStudents: 250,
    },
  });

  // Clean and re-seed students for DPS
  await prisma.student.deleteMany({ where: { schoolId: dps.id } });
  await prisma.student.createMany({
    data: [
      { schoolId: dps.id, name: 'Aarav Sharma', rollNo: 'DPS-2026-001', cgpa: 3.9, email: 'aarav.sharma@dps.edu', status: 'ACTIVE' },
      { schoolId: dps.id, name: 'Diya Patel', rollNo: 'DPS-2026-002', cgpa: 3.8, email: 'diya.patel@dps.edu', status: 'ACTIVE' },
      { schoolId: dps.id, name: 'Kabir Mehta', rollNo: 'DPS-2026-003', cgpa: 3.7, email: 'kabir.mehta@dps.edu', status: 'ACTIVE' },
      { schoolId: dps.id, name: 'Ananya Iyer', rollNo: 'DPS-2026-004', cgpa: 4.0, email: 'ananya.iyer@dps.edu', status: 'ACTIVE' },
      { schoolId: dps.id, name: 'Rohan Verma', rollNo: 'DPS-2026-005', cgpa: 3.6, email: 'rohan.verma@dps.edu', status: 'ACTIVE' },
    ],
  });

  console.log('✨ Enriched seeding completed!');
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

echo "[3/4] Generating client and pushing database..."
npx prisma generate
npx prisma db push --accept-data-loss
npx prisma db seed

echo "[4/4] Starting Next.js Development Server..."
npm run dev
