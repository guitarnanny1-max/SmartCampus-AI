const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const medRegex = /model MedicalRecord \{[^}]+\}/;
const newMedModel = `model MedicalRecord {
  id          String   @id @default(cuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  patientName String?
  studentName String?
  rollNo      String?
  symptoms    String?
  diagnosis   String?
  doctorName  String?
  condition   String?
  severity    String?
  status      String?
  treatment   String?
  createdAt   DateTime @default(now())
}`;

if (medRegex.test(schema)) {
  schema = schema.replace(medRegex, newMedModel);
} else {
  schema += "\n" + newMedModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added rollNo, symptoms, diagnosis, and doctorName fields to MedicalRecord model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
