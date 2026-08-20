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
  { 
    name: "SmartBioDigesterHub", 
    fields: "digesterCode String?\n  biomassCapacityKg Float?\n  methaneOutputPct Float?\n  efficiencyRating Float?\n  status String?" 
  },
  { name: "SmartCarbonHub", fields: "carbonOffsetTonnes Float?\n  emissionLevel String?\n  status String?" },
  { name: "SmartWaterHub", fields: "waterFlowLiters Float?\n  leakDetected Boolean?\n  status String?" },
  { name: "SmartSecurityHub", fields: "cameraCode String?\n  alertType String?\n  status String?" },
  { name: "SmartCafeteriaHub", fields: "mealName String?\n  calories Int?\n  status String?" },
  { name: "SmartParkingHub", fields: "slotNumber String?\n  isOccupied Boolean?\n  status String?" },
  { name: "SmartShuttleHub", fields: "shuttleName String?\n  occupancyRate Float?\n  status String?" }
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
console.log("✅ Added SmartBioDigesterHub and other hub models successfully.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
