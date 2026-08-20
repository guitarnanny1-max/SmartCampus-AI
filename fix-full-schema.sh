#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Restoring Complete Application Prisma Schema"
echo "=================================================="

mkdir -p prisma

cat << 'SCHEMA' > prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model School {
  id          String       @id @default(uuid())
  name        String
  code        String       @unique
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  facilities  Facility[]
  students    Student[]
  placements  Placement[]
  alerts      Alert[]
  auditLogs   AuditLog[]
  webhookLogs WebhookLog[]
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
SCHEMA

echo "[1/3] Generating fresh Prisma Client with all models..."
npx prisma generate

echo "[2/3] Pushing database schema & synchronizing tables..."
npx prisma db push --accept-data-loss

echo "[3/3] Starting Next.js Development Server..."
npm run dev
