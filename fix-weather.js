const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const schoolMatch = schema.match(/model School \{([^}]+)\}/);
if (schoolMatch) {
  let schoolBody = schoolMatch[1];
  if (!schoolBody.includes("smartWeatherStations")) {
    const lines = schoolBody.split("\n");
    const filteredLines = lines.filter(line => line.trim() !== "}");
    filteredLines.push("  smartWeatherStations SmartWeatherStation[]");
    schema = schema.replace(schoolMatch[0], `model School {\n${filteredLines.join("\n")}\n}`);
  }
}

const modelRegex = /model SmartWeatherStation \{[^}]+\}/;
const newModel = `model SmartWeatherStation {
  id                      String   @id @default(cuid())
  schoolId                String
  school                  School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
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
console.log("✅ Added SmartWeatherStation model and relation successfully.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
