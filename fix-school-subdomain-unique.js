const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// Make subdomain unique in School model
if (schema.includes("subdomain")) {
  schema = schema.replace(
    /subdomain\s+String\??/,
    "subdomain     String?   @unique"
  );
} else {
  schema = schema.replace(
    /model School \{([^}]+)\}/,
    `model School {$1
  subdomain     String?   @unique
}`
  );
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added @unique to subdomain in School model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
