const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

schema = schema.replace(/smartLmsOpenSourceHub\s+SmartLmsOpenSourceHub\[\]/g, "smartLmsOpenSources SmartLmsOpenSourceHub[]");
schema = schema.replace(/smartLmsOpenSource\s+SmartLmsOpenSourceHub\[\]/g, "smartLmsOpenSources SmartLmsOpenSourceHub[]");

if (!schema.includes("smartLmsOpenSources")) {
  const schoolMatch = schema.match(/model School \{([^}]+)\}/);
  if (schoolMatch) {
    let schoolBody = schoolMatch[1];
    const lines = schoolBody.split("\n");
    const filteredLines = lines.filter(line => line.trim() !== "}");
    filteredLines.push(`  smartLmsOpenSources SmartLmsOpenSourceHub[]`);
    const newSchoolBody = filteredLines.join("\n");
    schema = schema.replace(schoolMatch[0], `model School {\n${newSchoolBody}\n}`);
  }
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Updated School relation to smartLmsOpenSources.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
