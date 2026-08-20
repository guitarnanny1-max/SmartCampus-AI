const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const modelRegex = /model SmartGymEquipment \{[^}]+\}/;
const newModel = `model SmartGymEquipment {
  id                 String   @id @default(cuid())
  schoolId           String
  school             School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  equipmentCode      String?
  equipmentName      String?
  category           String?
  zoneName           String?
  occupancyStatus    String?
  sensorBattery      Int?
  resistanceKg       Float?
  aiBiometricMode    String?
  status             String?
  notes              String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}`;

if (modelRegex.test(schema)) {
  schema = schema.replace(modelRegex, newModel);
} else {
  schema += "\n" + newModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Updated SmartGymEquipment model with zoneName and all required fields.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
