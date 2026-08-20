const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const assetTrackerRegex = /model SmartAssetTracker \{[^}]+\}/;
const newAssetTrackerModel = `model SmartAssetTracker {
  id           String   @id @default(cuid())
  schoolId     String
  school       School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  assetCode    String?
  assetName    String
  category     String?
  buildingName String?
  location     String?
  status       String?
  batteryLevel Int?
  createdAt    DateTime @default(now())
}`;

if (assetTrackerRegex.test(schema)) {
  schema = schema.replace(assetTrackerRegex, newAssetTrackerModel);
} else {
  schema += "\n" + newAssetTrackerModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added assetCode and buildingName fields to SmartAssetTracker model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
