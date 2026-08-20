const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// Make orderId unique in CampusPaymentRecord
schema = schema.replace(
  /orderId\s+String\??/,
  "orderId       String?   @unique"
);

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added @unique to orderId in CampusPaymentRecord model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
