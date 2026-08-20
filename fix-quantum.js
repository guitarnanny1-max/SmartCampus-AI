const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

function ensureSchoolRelation(modelName) {
  const schoolMatch = schema.match(/model School \{([^}]+)\}/);
  if (schoolMatch) {
    let schoolBody = schoolMatch[1];
    const camelCase = modelName.charAt(0).toLowerCase() + modelName.slice(1) + "s";
    if (!schoolBody.includes(camelCase) && !schoolBody.includes(modelName.charAt(0).toLowerCase() + modelName.slice(1))) {
      const lines = schoolBody.split("\n");
      const filteredLines = lines.filter(line => line.trim() !== "}");
      filteredLines.push(`  ${camelCase} ${modelName}[]`);
      const newSchoolBody = filteredLines.join("\n");
      schema = schema.replace(schoolMatch[0], `model School {\n${newSchoolBody}\n}`);
    }
  }
}

ensureSchoolRelation("SmartQuantumResearchHub");

const modelRegex = /model SmartQuantumResearchHub \{[^}]+\}/;
const newModel = `model SmartQuantumResearchHub {
  id                       String   @id @default(cuid())
  schoolId                 String
  school                   School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  nodeCode                 String?
  nodeName                 String?
  qubitCount               Int?
  coherenceTimeSec         Float?
  errorCorrectionAlgorithm String?
  status                   String?
  notes                    String?
  createdAt                DateTime @default(now())
  updatedAt                DateTime @updatedAt
}`;

if (modelRegex.test(schema)) {
  schema = schema.replace(modelRegex, newModel);
} else {
  schema += "\n" + newModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added SmartQuantumResearchHub model and relation successfully.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
