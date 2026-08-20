const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// 1. Ensure SmartAiTutorProctorHub relation is added to model School if not present
const schoolMatch = schema.match(/model School \{([^}]+)\}/);
if (schoolMatch) {
  let schoolBody = schoolMatch[1];
  if (!schoolBody.includes("smartAiTutorProctorHub")) {
    const lines = schoolBody.split("\n");
    const filteredLines = lines.filter(line => line.trim() !== "}");
    filteredLines.push("  smartAiTutorProctorHub SmartAiTutorProctorHub[]");
    const newSchoolBody = filteredLines.join("\n");
    schema = schema.replace(schoolMatch[0], `model School {\n${newSchoolBody}\n}`);
  }
}

// 2. Add SmartAiTutorProctorHub model if it doesn't exist
if (!schema.includes("model SmartAiTutorProctorHub")) {
  const newModel = `
model SmartAiTutorProctorHub {
  id             String   @id @default(cuid())
  schoolId       String
  school         School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName    String?
  courseName     String?
  sessionTitle   String?
  aiConfidence   Float?
  proctorStatus  String?
  status         String?
  notes          String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
`;
  schema += "\n" + newModel;
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added SmartAiTutorProctorHub model and relation successfully.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
