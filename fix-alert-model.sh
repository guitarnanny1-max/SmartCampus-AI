#!/bin/bash
set -e

echo "=========================================="
echo " Adding Models Safely to Prisma Schema..."
echo "=========================================="

python3 -c '
with open("prisma/schema.prisma", "r") as f:
    content = f.read()

models_to_add = [
    """
model Placement {
  id          String   @id @default(uuid())
  schoolId    String
  companyName String
  studentName String
  package     String
  createdAt   DateTime @default(now())
}""",
    """
model Alert {
  id        String   @id @default(uuid())
  schoolId  String
  message   String
  createdAt DateTime @default(now())
}""",
    """
model AuditLog {
  id        String   @id @default(uuid())
  schoolId  String
  action    String
  createdAt DateTime @default(now())
}""",
    """
model WebhookLog {
  id        String   @id @default(uuid())
  schoolId  String
  event     String
  payload   String?
  createdAt DateTime @default(now())
}"""
]

for model_def in models_to_add:
    model_name = model_def.split("{")[0].replace("model", "").strip()
    if f"model {model_name} " not in content:
        content += "\n" + model_def

with open("prisma/schema.prisma", "w") as f:
    f.write(content)

print("✨ Models appended safely without relation constraints!")
'

echo "[1/3] Generating Prisma Client..."
npx prisma generate

echo "[2/3] Pushing Database Schema..."
npx prisma db push

echo "[3/3] Starting Next.js Development Server..."
npm run dev
