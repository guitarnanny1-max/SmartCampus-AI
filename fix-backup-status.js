const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

if (schema.includes("model BackupSnapshot") && !schema.includes("status")) {
  schema = schema.replace(
    /model BackupSnapshot \{([^}]+)\}/,
    'model BackupSnapshot {$1  status    String?\n}'
  );
  fs.writeFileSync(schemaPath, schema, "utf8");
  console.log("✅ Added status field to BackupSnapshot model in prisma/schema.prisma");
}

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
