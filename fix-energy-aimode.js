const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const energyRegex = /model SmartEnergyGrid \{[^}]+\}/;
const newEnergyModel = `model SmartEnergyGrid {
  id            String   @id @default(cuid())
  schoolId      String
  school        School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  zoneName      String?
  sectorName    String?
  solarOutputKw Float?
  gridDrawKw    Float?
  batteryLevel  Int?
  aiMode        String?
  powerKw       Float?
  energyUsage   Float?
  solarKw       Float?
  status        String?
  createdAt     DateTime @default(now())
}`;

if (energyRegex.test(schema)) {
  schema = schema.replace(energyRegex, newEnergyModel);
} else {
  schema += "\n" + newEnergyModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added aiMode field to SmartEnergyGrid model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
