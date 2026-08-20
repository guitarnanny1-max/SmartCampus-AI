#!/bin/bash
set -e

echo "=================================================="
echo " 🛠️ Rebuilding Corrupted Prisma Schema Cleanly"
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

model User {
  id        String   @id @default(uuid())
  name      String?
  email     String?  @unique
  role      String   @default("Student")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Event {
  id          String   @id @default(uuid())
  title       String   @default("Campus Event")
  status      String   @default("ACTIVE")
  category    String   @default("National")
  description String   @default("Flag hoisting, cultural programs, and student competitions.")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model WellnessRecord {
  id                String   @id @default(uuid())
  department        String   @default("Computer Science")
  walkingDistanceKm String   @default("6.4 km")
  heartRateAvg      String   @default("72 bpm")
  wellnessStatus    String   @default("EXCELLENT")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model LmsIntegration {
  id                String   @id @default(uuid())
  category          String   @default("SCORM/xAPI Engine")
  version           String   @default("v4.2.1")
  integrationStatus String   @default("ACTIVE")
  repositoryUrl     String   @default("https://github.com/open-source-lms/enhancement-core")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model SupportTicket {
  id        String   @id @default(uuid())
  userRole  String   @default("Student")
  status    String   @default("RESOLVED")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ExamPrep {
  id        String   @id @default(uuid())
  prepType  String   @default("SUBJECT_PREP")
  status    String   @default("PASSED")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
SCHEMA

echo "[1/3] Generating fresh Prisma Client..."
npx prisma generate

echo "[2/3] Pushing database schema..."
npx prisma db push --accept-data-loss

echo "[3/3] Starting Next.js Development Server..."
npm run dev
