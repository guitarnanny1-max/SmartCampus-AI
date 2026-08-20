#!/bin/bash
set -e

echo "=================================================="
echo " 💳 Integrating Stripe Billing & Subscription Metering"
echo "=================================================="

mkdir -p prisma src/lib src/app/api/billing

echo "[1/4] Updating Prisma Schema with Subscription & Metering fields..."
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
  maxStudents        Int          @default(500)
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

echo "[2/4] Updating Database Seeder with Tier & Capacity metadata..."
cat << 'JAVASCRIPT' > prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with Stripe subscription tiers...');

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

  console.log('✨ Stripe subscription seeding completed!');
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

echo "[3/4] Generating Prisma Client and pushing database..."
npx prisma generate
npx prisma db push --accept-data-loss
npx prisma db seed

echo "[4/4] Starting Next.js Development Server..."
npm run dev
