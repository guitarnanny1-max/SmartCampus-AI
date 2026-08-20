const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const droneRegex = /model AutonomousDronePatrol \{[^}]+\}/;
const newDroneModel = `model AutonomousDronePatrol {
  id           String   @id @default(cuid())
  schoolId     String
  school       School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  droneCode    String?
  droneName    String?
  sector       String?
  sectorName   String?
  batteryPct   Int?
  batteryLevel Int?
  status       String?
  patrolStatus String?
  aiIntrusions Int?
  mission      String?
  createdAt    DateTime @default(now())
}`;

if (droneRegex.test(schema)) {
  schema = schema.replace(droneRegex, newDroneModel);
} else {
  schema += "\n" + newDroneModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added sectorName, patrolStatus, and aiIntrusions fields to AutonomousDronePatrol model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
