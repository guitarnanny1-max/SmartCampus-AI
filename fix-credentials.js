const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// Add relation field to School model if not already present
if (!schema.includes("digitalCredentials")) {
  schema = schema.replace(
    /model School \{([^}]+)\}/,
    `model School {$1
  digitalCredentials DigitalCredential[]
}`
  );
}

// Append DigitalCredential model if not already present
if (!schema.includes("model DigitalCredential")) {
  schema += `
model DigitalCredential {
  id             String   @id @default(cuid())
  schoolId       String
  school         School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName    String?
  credentialType String?
  credentialCode String?
  issueDate      String?
  status         String?
  hash           String?
  createdAt      DateTime @default(now())
}
`;
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added DigitalCredential model and relation to prisma/schema.prisma");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
