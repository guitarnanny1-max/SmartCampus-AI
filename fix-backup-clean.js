const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// Remove existing BackupSnapshot model if any
schema = schema.replace(/model BackupSnapshot\s*\{[^}]*\}/g, "");

// Append clean BackupSnapshot model
schema += `
model BackupSnapshot {
  id        String   @id @default(cuid())
  schoolId  String
  filename  String
  size      String?
  status    String?
  createdAt DateTime @default(now())
}
`;

fs.writeFileSync(schemaPath, schema.trim() + "\n", "utf8");
console.log("✅ Rewrote prisma/schema.prisma with clean BackupSnapshot model including status.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
