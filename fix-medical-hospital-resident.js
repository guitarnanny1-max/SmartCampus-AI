const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const modelRegex = /model SmartMedicalHospitalHub \{[^}]+\}/;
const newModel = `model SmartMedicalHospitalHub {
  id                    String    @id @default(cuid())
  schoolId              String
  school                School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  departmentCode        String?
  departmentName        String?
  hospitalBedsCount     Int?
  dailyOpdFootfall      Int?
  emergencyTriageActive Boolean?
  residentDoctorsCount  Int?
  aiDiagnosticMode      String?
  doctorName            String?
  patientCount          Int?
  triageLevel           String?
  status                String?
  notes                 String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}`;

if (modelRegex.test(schema)) {
  schema = schema.replace(modelRegex, newModel);
} else {
  schema += "\n" + newModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Updated SmartMedicalHospitalHub model with residentDoctorsCount and aiDiagnosticMode.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
