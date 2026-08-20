const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// Add relation field to School model if not already present
if (!schema.includes("smartHvacUnits")) {
  schema = schema.replace(
    /model School \{([^}]+)\}/,
    `model School {$1
  smartHvacUnits SmartHvacUnit[]
}`
  );
}

// Append SmartHvacUnit model if not already present
if (!schema.includes("model SmartHvacUnit")) {
  schema += `
model SmartHvacUnit {
  id           String   @id @default(cuid())
  schoolId     String
  school       School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  unitCode     String?
  locationName String?
  zoneName     String?
  targetTempC  Float?
  currentTempC Float?
  mode         String?
  fanSpeed     String?
  status       String?
  createdAt    DateTime @default(now())
}
`;
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added SmartHvacUnit model and relation to prisma/schema.prisma");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
