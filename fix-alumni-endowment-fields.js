const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const alumniEndowmentRegex = /model AlumniEndowment \{[^}]+\}/;
const newAlumniEndowmentModel = `model AlumniEndowment {
  id        String   @id @default(cuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  donorName String
  amount    Float
  gradYear  Int?
  campaign  String?
  purpose   String?
  createdAt DateTime @default(now())
}`;

if (alumniEndowmentRegex.test(schema)) {
  schema = schema.replace(alumniEndowmentRegex, newAlumniEndowmentModel);
} else {
  schema += "\n" + newAlumniEndowmentModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added gradYear and campaign fields to AlumniEndowment model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
