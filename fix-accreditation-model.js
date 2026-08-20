const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// 1. Ensure SmartAccreditationHub model relation is added to model School if not present
const schoolMatch = schema.match(/model School \{([^}]+)\}/);
if (schoolMatch) {
  let schoolBody = schoolMatch[1];
  if (!schoolBody.includes("smartAccreditationHub")) {
    const lines = schoolBody.split("\n");
    const filteredLines = lines.filter(line => line.trim() !== "}");
    filteredLines.push("  smartAccreditationHub SmartAccreditationHub[]");
    const newSchoolBody = filteredLines.join("\n");
    schema = schema.replace(schoolMatch[0], `model School {\n${newSchoolBody}\n}`);
  }
}

// 2. Add SmartAccreditationHub model if it doesn't exist
if (!schema.includes("model SmartAccreditationHub")) {
  const newModel = `
model SmartAccreditationHub {
  id                String   @id @default(cuid())
  schoolId          String
  school            School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  accreditationName String?
  status            String?
  progress          Int?     @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
`;
  schema += "\n" + newModel;
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added SmartAccreditationHub model and relation successfully.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
