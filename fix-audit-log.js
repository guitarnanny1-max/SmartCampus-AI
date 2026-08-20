const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

if (!schema.includes("model AuditLog")) {
  if (!schema.includes("auditLogs")) {
    schema = schema.replace(
      /model School \{([^}]+)\}/,
      `model School {$1
  auditLogs AuditLog[]
}`
    );
  }
  schema += `
model AuditLog {
  id        String   @id @default(cuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  action    String?
  details   String?
  createdAt DateTime @default(now())
}
`;
} else {
  const auditLogRegex = /model AuditLog \{([^}]+)\}/;
  const match = schema.match(auditLogRegex);
  if (match && !match[1].includes("details")) {
    const updatedAuditLog = match[0].replace(
      /model AuditLog \{/,
      `model AuditLog {\n  details   String?`
    );
    schema = schema.replace(auditLogRegex, updatedAuditLog);
  }
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added details field to AuditLog model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
