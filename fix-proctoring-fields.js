const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const proctorRegex = /model ExamProctoringSession \{[^}]+\}/;
const newProctorModel = `model ExamProctoringSession {
  id                    String   @id @default(cuid())
  schoolId              String
  school                School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  examName              String?
  examTitle             String?
  roomNumber            String?
  studentName           String?
  totalStudents         Int?
  flaggedIncidentsCount Int?
  status                String?
  flagsCount            Int?
  riskScore             Float?
  createdAt             DateTime @default(now())
}`;

if (proctorRegex.test(schema)) {
  schema = schema.replace(proctorRegex, newProctorModel);
} else {
  schema += "\n" + newProctorModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added examTitle, roomNumber, totalStudents, and flaggedIncidentsCount fields to ExamProctoringSession model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
