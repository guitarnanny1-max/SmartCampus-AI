const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const labRegex = /model LabEquipment \{[^}]+\}/;
const newLabModel = `model LabEquipment {
  id            String   @id @default(cuid())
  schoolId      String
  school        School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name          String?
  equipmentName String?
  serialNumber  String?
  labName       String?
  labRoom       String?
  category      String?
  status        String?
  condition     String?
  borrower      String?
  createdAt     DateTime @default(now())
}`;

if (labRegex.test(schema)) {
  schema = schema.replace(labRegex, newLabModel);
} else {
  schema += "\n" + newLabModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added borrower field to LabEquipment model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
