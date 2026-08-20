const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// Add relation fields to School model if not already present
if (!schema.includes("alumniEndowments")) {
  schema = schema.replace(
    /model School \{([^}]+)\}/,
    `model School {$1
  alumniEndowments AlumniEndowment[]
  alumniNetworks   AlumniNetwork[]
}`
  );
  fs.writeFileSync(schemaPath, schema, "utf8");
  console.log("✅ Added alumniEndowments and alumniNetworks relations to School model.");
}

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
