const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const scholarshipRegex = /model ScholarshipApplication \{[^}]+\}/;
const newScholarshipModel = `model ScholarshipApplication {
  id              String   @id @default(cuid())
  schoolId        String
  school          School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName     String?
  rollNo          String?
  scholarshipName String?
  fundCategory    String?
  amount          Float?
  amountRequested Float?
  status          String?
  createdAt       DateTime @default(now())
}`;

if (scholarshipRegex.test(schema)) {
  schema = schema.replace(scholarshipRegex, newScholarshipModel);
} else {
  schema += "\n" + newScholarshipModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added rollNo, fundCategory, and amountRequested fields to ScholarshipApplication model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
