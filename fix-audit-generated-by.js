const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const auditRegex = /model AuditReport \{[^}]+\}/;
const newAuditModel = `model AuditReport {
  id          String   @id @default(cuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title       String?
  category    String?
  status      String?
  author      String?
  generatedBy String?
  fileSize    String?
  createdAt   DateTime @default(now())
}`;

if (auditRegex.test(schema)) {
  schema = schema.replace(auditRegex, newAuditModel);
} else {
  schema += "\n" + newAuditModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added generatedBy field to AuditReport model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
