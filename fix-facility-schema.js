const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const facilityModelRegex = /model Facility \{[^}]+\}/;
const newFacilityModel = `model Facility {
  id       String  @id @default(cuid())
  schoolId String
  school   School  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name     String?
  type     String?
  zoneName String?
  solar    String?
  hvac     String?
  status   String?
}`;

if (facilityModelRegex.test(schema)) {
  schema = schema.replace(facilityModelRegex, newFacilityModel);
} else {
  schema += "\n" + newFacilityModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Updated Facility model in prisma/schema.prisma with smart campus properties.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
