const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

function ensureSchoolRelation(modelName) {
  const schoolMatch = schema.match(/model School \{([^}]+)\}/);
  if (schoolMatch) {
    let schoolBody = schoolMatch[1];
    const camelCase = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    if (!schoolBody.includes(camelCase)) {
      const lines = schoolBody.split("\n");
      const filteredLines = lines.filter(line => line.trim() !== "}");
      filteredLines.push(`  ${camelCase} ${modelName}[]`);
      const newSchoolBody = filteredLines.join("\n");
      schema = schema.replace(schoolMatch[0], `model School {\n${newSchoolBody}\n}`);
    }
  }
}

const hubs = [
  { name: "SmartAutonomousFleetHub", fields: "vehicleName String?\n  fleetNumber String?\n  batteryLevel Float?\n  speed Float?\n  autonomousStatus String?\n  status String?" },
  { name: "SmartEnergyHub", fields: "meterName String?\n  powerConsumption Float?\n  solarGeneration Float?\n  energyStatus String?\n  status String?" },
  { name: "SmartResearchHub", fields: "projectName String?\n  principalInvestigator String?\n  grantAmount Float?\n  researchStatus String?\n  status String?" },
  { name: "SmartLibraryHub", fields: "bookTitle String?\n  authorName String?\n  isbn String?\n  borrowerName String?\n  libraryStatus String?\n  status String?" },
  { name: "SmartSportsHub", fields: "equipmentName String?\n  sportName String?\n  conditionStatus String?\n  status String?" },
  { name: "SmartCanteenHub", fields: "itemName String?\n  category String?\n  price Float?\n  stockCount Int?\n  status String?" },
  { name: "SmartLaboratoryHub", fields: "labName String?\n  equipmentName String?\n  safetyStatus String?\n  status String?" },
  { name: "SmartGateHub", fields: "gateNumber String?\n  visitorName String?\n  entryTime DateTime?\n  exitTime DateTime?\n  accessStatus String?\n  status String?" },
  { name: "SmartHealthHub", fields: "patientName String?\n  doctorName String?\n  diagnosis String?\n  triageLevel String?\n  status String?" }
];

hubs.forEach(hub => {
  ensureSchoolRelation(hub.name);
  if (!schema.includes(`model ${hub.name}`)) {
    schema += `
model ${hub.name} {
  id        String   @id @default(cuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  ${hub.fields}
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;
  }
});

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added SmartAutonomousFleetHub and all other hub models successfully.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
