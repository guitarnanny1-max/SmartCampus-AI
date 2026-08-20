const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
const fullSchema = `
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model School {
  id                 String           @id @default(cuid())
  name               String           @default("Delhi Public School")
  code               String           @default("DPS-2026")
  subdomain          String?
  email              String?
  maxStudents        Int?
  tier               String?
  subscriptionTier   String?
  subscriptionStatus String?
  stripeStatus       String?
  createdAt          DateTime         @default(now())
  updatedAt          DateTime         @default(now()) @updatedAt

  facilities         Facility[]
  students           Student[]
  placements         Placement[]
  backupSnapshots    BackupSnapshot[]
  invoices           Invoice[]
  alerts             Alert[]
  auditLogs          AuditLog[]
  apiKeys            ApiKey[]
}

model Facility {
  id       String @id @default(cuid())
  schoolId String
  school   School @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name     String
  type     String?
}

model Student {
  id       String @id @default(cuid())
  schoolId String
  school   School @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name     String
  grade    String?
}

model Placement {
  id       String @id @default(cuid())
  schoolId String
  school   School @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  company  String
  package  String?
}

model BackupSnapshot {
  id        String   @id @default(cuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  filename  String
  size      String?
  status    String?
  createdAt DateTime @default(now())
}

model Invoice {
  id        String   @id @default(cuid())
  schoolId  String?
  school    School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title     String
  amount    Float
  date      String
  status    String
  createdAt DateTime @default(now())
}

model Alert {
  id       String @id @default(cuid())
  schoolId String
  school   School @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  message  String
  severity String?
}

model AuditLog {
  id        String   @id @default(cuid())
  schoolId  String
  school    School @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  action    String
  createdAt DateTime @default(now())
}

model ApiKey {
  id       String @id @default(cuid())
  schoolId String
  school   School @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  key      String
  name     String?
}
`;

fs.writeFileSync(schemaPath, fullSchema.trim() + "\n", "utf8");
console.log("✅ Added createdAt field to Invoice model in prisma/schema.prisma.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
