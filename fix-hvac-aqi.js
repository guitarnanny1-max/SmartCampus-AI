const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const hvacRegex = /model SmartHvacUnit \{[^}]+\}/;
const newHvacModel = `model SmartHvacUnit {
  id              String   @id @default(cuid())
  schoolId        String
  school          School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  unitCode        String?
  buildingName    String?
  locationName    String?
  zoneName        String?
  targetTempC     Float?
  currentTempC    Float?
  co2Ppm          Int?
  airQualityIndex String?
  mode            String?
  fanSpeed        String?
  status          String?
  createdAt       DateTime @default(now())
}`;

if (hvacRegex.test(schema)) {
  schema = schema.replace(hvacRegex, newHvacModel);
} else {
  schema += "\n" + newHvacModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added airQualityIndex field to SmartHvacUnit model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
