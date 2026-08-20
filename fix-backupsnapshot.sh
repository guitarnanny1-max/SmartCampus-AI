#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Adding BackupSnapshot Model to Prisma Schema"
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
  id                 String           @id @default(uuid())
  name               String
  code               String?          @unique
  subdomain          String?          @unique
  email              String?
  tier               String           @default("ENTERPRISE")
  maxStudents        Int              @default(1000)
  stripeCustomerId   String?          @unique
  stripeSubscription String?          @unique
  stripeStatus       String           @default("ACTIVE")
  createdAt          DateTime         @default(now())
  updatedAt          DateTime         @updatedAt
  facilities         Facility[]
  students           Student[]
  placements         Placement[]
  alerts             Alert[]
  auditLogs          AuditLog[]
  webhookLogs        WebhookLog[]
  apiKeys            ApiKey[]
  backupSnapshots    BackupSnapshot[]
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

model BackupSnapshot {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  filename    String
  size        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
SCHEMA

echo "[1/3] Generating Prisma Client with BackupSnapshot support..."
npx prisma generate

echo "[2/3] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[3/3] Verifying Next.js Production Build..."
npm run build

echo "✨ Build verified successfully!"
