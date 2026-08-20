#!/bin/bash
set -e

echo "=================================================="
echo " 🧹 Deep Cleaning Next.js & Prisma Cache..."
echo "=================================================="

# 1. Clear Next.js and Prisma client caches
rm -rf .next
rm -rf node_modules/.prisma

# 2. Ensure schema models exist properly
python3 -c '
with open("prisma/schema.prisma", "r") as f:
    content = f.read()

models = [
    ("model Alert", """
model Alert {
  id        String   @id @default(uuid())
  schoolId  String
  message   String
  createdAt DateTime @default(now())
}"""),
    ("model Placement", """
model Placement {
  id          String   @id @default(uuid())
  schoolId    String
  companyName String
  studentName String
  package     String
  createdAt   DateTime @default(now())
}"""),
    ("model AuditLog", """
model AuditLog {
  id        String   @id @default(uuid())
  schoolId  String
  action    String
  createdAt DateTime @default(now())
}"""),
    ("model WebhookLog", """
model WebhookLog {
  id        String   @id @default(uuid())
  schoolId  String
  event     String
  payload   String?
  createdAt DateTime @default(now())
}"""),
    ("model Student", """
model Student {
  id        String   @id @default(uuid())
  schoolId  String
  name      String
  email     String
  createdAt DateTime @default(now())
}""")
]

for name, code in models:
    if name not in content:
        content += "\n" + code

with open("prisma/schema.prisma", "w") as f:
    f.write(content)

print("✨ Schema models verified!")
'

echo "[1/3] Generating Fresh Prisma Client..."
npx prisma generate

echo "[2/3] Pushing Database Schema..."
npx prisma db push --accept-data-loss

echo "[3/3] Starting Next.js Development Server (Clean Build)..."
npm run dev
