const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const credentialRegex = /model DigitalCredential \{[^}]+\}/;
const newCredentialModel = `model DigitalCredential {
  id              String   @id @default(cuid())
  schoolId        String
  school          School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName     String?
  rollNo          String?
  credentialTitle String?
  credentialType  String?
  credentialCode  String?
  issueHash       String?
  issueDate       String?
  status          String?
  hash            String?
  createdAt       DateTime @default(now())
}`;

if (credentialRegex.test(schema)) {
  schema = schema.replace(credentialRegex, newCredentialModel);
} else {
  schema += "\n" + newCredentialModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added rollNo, credentialTitle, and issueHash fields to DigitalCredential model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
