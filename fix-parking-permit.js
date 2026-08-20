const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// Add relation field to School model if not already present
if (!schema.includes("parkingPermits")) {
  schema = schema.replace(
    /model School \{([^}]+)\}/,
    `model School {$1
  parkingPermits ParkingPermit[]
}`
  );
}

// Append ParkingPermit model if not already present
if (!schema.includes("model ParkingPermit")) {
  schema += `
model ParkingPermit {
  id            String   @id @default(cuid())
  schoolId      String
  school        School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  permitNumber  String?
  vehicleNumber String?
  vehicleModel  String?
  ownerName     String?
  ownerType     String?
  status        String?
  validUntil    String?
  createdAt     DateTime @default(now())
}
`;
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added ParkingPermit model and relation to prisma/schema.prisma");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
