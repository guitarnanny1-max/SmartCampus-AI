#!/bin/bash
set -e

echo "=========================================="
echo " Fixing Missing Prisma Models & Starting..."
echo "=========================================="

python3 -c '
with open("prisma/schema.prisma", "r") as f:
    content = f.read()

if "model Placement {" not in content:
    content += "\nmodel Placement {\n  id          String   @id @default(uuid())\n  schoolId    String\n  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)\n  companyName String\n  studentName String\n  package     String\n  createdAt   DateTime @default(now())}\n"

if "model Alert {" not in content:
    content += "\nmodel Alert {\n  id        String   @id @default(uuid())\n  schoolId  String\n  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)\n  message   String\n  createdAt DateTime @default(now())}\n"

if "model AuditLog {" not in content:
    content += "\nmodel AuditLog {\n  id        String   @id @default(uuid())\n  schoolId  String\n  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)\n  action    String\n  createdAt DateTime @default(now())}\n"

if "model WebhookLog {" not in content:
    content += "\nmodel WebhookLog {\n  id        String   @id @default(uuid())\n  schoolId  String\n  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)\n  event     String\n  payload   String?\n  createdAt DateTime @default(now())}\n"

with open("prisma/schema.prisma", "w") as f:
    f.write(content)

print("✨ All required models verified in schema.prisma!")
'

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing Database Schema..."
npx prisma db push

echo "[3/3] Starting Next.js Development Server..."
npm run dev
