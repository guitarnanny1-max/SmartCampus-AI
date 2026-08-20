const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const modelRegex = /model SmartWeatherStation \{[^}]+\}/;
const newModel = `model SmartWeatherStation {
  id                      String   @id @default(cuid())
  schoolId                String
  school                  School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  uvIndex                 Float?
  precipitationMm         Float?
  weatherAlertStatus      String?
  stationCode             String?
  stationName             String?
  temperatureC            Float?
  humidityPct             Float?
  barometricPressureHpa   Float?
  windSpeedKmh            Float?
  rainfallMm              Float?
  aiWeatherPredictionMode String?
  status                  String?
  notes                   String?
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
}`;

if (modelRegex.test(schema)) {
  schema = schema.replace(modelRegex, newModel);
} else {
  schema += "\n" + newModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Updated SmartWeatherStation model with uvIndex, precipitationMm, and weatherAlertStatus fields.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
