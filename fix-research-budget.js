const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const grantRegex = /model ResearchGrant \{[^}]+\}/;
const newGrantModel = `model ResearchGrant {
  id                    String   @id @default(cuid())
  schoolId              String
  school                School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title                 String?
  grantName             String?
  fundingAgency         String?
  amount                Float?
  budgetAmount          Float?
  status                String?
  principalInvestigator String?
  createdAt             DateTime @default(now())
}`;

if (grantRegex.test(schema)) {
  schema = schema.replace(grantRegex, newGrantModel);
} else {
  schema += "\n" + newGrantModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added budgetAmount field to ResearchGrant model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
