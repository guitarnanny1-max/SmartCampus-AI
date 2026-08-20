#!/bin/bash
set -e

echo "=========================================="
echo " Fixing Prisma Models & Regenerating Client"
echo "=========================================="

python3 -c '
with open("prisma/schema.prisma", "r") as f:
    content = f.read()

models_to_add = {
    "model Placement": """
model Placement {
  id          String   @id @default(uuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  companyName String
  studentName String
  package     String
  createdAt   DateTime @default(now())
}""",
    "model Alert": """
model Alert {
  id        String   @id @default(uuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  message   String
  createdAt DateTime @default(now())
}""",
    "model AuditLog": """
model AuditLog {
  id        String   @id @default(uuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  action    String
  createdAt DateTime @default(now())
}""",
    "model WebhookLog": """
model WebhookLog {
  id        String   @id @default(uuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  event     String
  payload   String?
  createdAt DateTime @default(now())
}"""
}

modified = False
for key, model_def in models_to_add.items():
    if key not in content:
        content += "\n" + model_def
        modified = True

if modified:
    with open("prisma/schema.prisma", "w") as f:
        f.write(content)
    print("✨ Missing models successfully added to schema.prisma!")
else:
    print("✨ All models already present in schema.prisma!")
'

echo "[1/3] Generating fresh Prisma Client..."
npx prisma generate

echo "[2/3] Pushing database schema..."
npx prisma db push

echo "[3/3] Starting Next.js development server..."
npm run dev
