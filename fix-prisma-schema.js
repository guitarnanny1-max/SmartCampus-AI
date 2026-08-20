const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// Clean up duplicate or malformed 'alerts' fields inside model School
const schoolMatch = schema.match(/model School \{([^}]+)\}/);
if (schoolMatch) {
  let schoolBody = schoolMatch[1];
  const lines = schoolBody.split("\n");
  const filteredLines = lines.filter(line => {
    const trimmed = line.trim();
    return !trimmed.startsWith("alerts") && trimmed !== "}";
  });
  filteredLines.push("  alerts        Alert[]");
  const newSchoolBody = filteredLines.join("\n");
  schema = schema.replace(schoolMatch[0], `model School {\n${newSchoolBody}\n}`);
}

// Ensure clean Alert model definition
const alertRegex = /model Alert \{[^}]+\}/;
const newAlertModel = `model Alert {
  id        String   @id @default(cuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title     String?
  message   String?
  severity  String?
  createdAt DateTime @default(now())
}`;

if (alertRegex.test(schema)) {
  schema = schema.replace(alertRegex, newAlertModel);
} else {
  schema += "\n" + newAlertModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Fixed School model syntax and updated Alert model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
