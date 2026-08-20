const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const parkingRegex = /model SmartParkingBay \{[^}]+\}/;
const newParkingModel = `model SmartParkingBay {
  id            String   @id @default(cuid())
  schoolId      String
  school        School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  bayNumber     String?
  bayNo         String?
  parkingLot    String?
  lotName       String?
  zone          String?
  zoneName      String?
  isEvCharging  Boolean?
  vehicleNumber String?
  vehicleType   String?
  status        String?
  category      String?
  createdAt     DateTime @default(now())
}`;

if (parkingRegex.test(schema)) {
  schema = schema.replace(parkingRegex, newParkingModel);
} else {
  schema += "\n" + newParkingModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added bayNo, zoneName, and isEvCharging fields to SmartParkingBay model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
