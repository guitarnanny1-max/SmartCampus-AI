const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const deliveryRegex = /model DeliveryFleet \{[^}]+\}/;
const newDeliveryModel = `model DeliveryFleet {
  id                 String   @id @default(cuid())
  schoolId           String
  school             School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  vehicleCode        String?
  vehicleName        String?
  vehicleType        String?
  currentLocation    String?
  batteryLevel       Int?
  batteryPct         Int?
  currentBattery     Int?
  status             String?
  destination        String?
  payloadDescription String?
  createdAt          DateTime @default(now())
}`;

if (deliveryRegex.test(schema)) {
  schema = schema.replace(deliveryRegex, newDeliveryModel);
} else {
  schema += "\n" + newDeliveryModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added currentBattery and payloadDescription fields to DeliveryFleet model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
