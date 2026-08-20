const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const crisisRegex = /model CrisisIncident \{[^}]+\}/;
const newCrisisModel = `model CrisisIncident {
  id           String   @id @default(cuid())
  schoolId     String
  school       School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title        String
  incidentType String?
  severity     String?
  location     String?
  assignedTeam String?
  status       String?
  description  String?
  createdAt    DateTime @default(now())
}`;

if (crisisRegex.test(schema)) {
  schema = schema.replace(crisisRegex, newCrisisModel);
} else {
  schema += "\n" + newCrisisModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added assignedTeam field to CrisisIncident model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
