const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const permitRegex = /model ParkingPermit \{[^}]+\}/;
const newPermitModel = `model ParkingPermit {
  id            String   @id @default(cuid())
  schoolId      String
  school        School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  permitNumber  String?
  permitType    String?
  vehicleNumber String?
  vehicleNo     String?
  vehicleModel  String?
  slotNo        String?
  ownerName     String?
  ownerType     String?
  status        String?
  validUntil    String?
  createdAt     DateTime @default(now())
}`;

if (permitRegex.test(schema)) {
  schema = schema.replace(permitRegex, newPermitModel);
} else {
  schema += "\n" + newPermitModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added vehicleNo, permitType, and slotNo fields to ParkingPermit model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
