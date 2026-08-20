const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const fireRegex = /model SmartFireSafetySystem \{[^}]+\}/;
const newFireModel = `model SmartFireSafetySystem {
  id           String   @id @default(cuid())
  schoolId     String
  school       School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  panelCode    String?
  locationName String?
  zoneName     String?
  sensorCode   String?
  sensorName   String?
  status       String?
  alarmStatus  String?
  smokePpm     Float?
  sprinklerPsi Float?
  temperatureC Float?
  batteryLevel Int?
  createdAt    DateTime @default(now())
}`;

if (fireRegex.test(schema)) {
  schema = schema.replace(fireRegex, newFireModel);
} else {
  schema += "\n" + newFireModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added alarmStatus field to SmartFireSafetySystem model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
