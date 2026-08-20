const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const filePath = "scripts/backup-snapshots.ts";
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, "utf8");
  // Replace school.subdomain with school.code
  content = content.replace(/school\.subdomain/g, "school.code");
  fs.writeFileSync(filePath, content, "utf8");
  console.log("✅ Updated scripts/backup-snapshots.ts to use school.code instead of subdomain.");
} else {
  console.log("⚠️ scripts/backup-snapshots.ts not found, skipping file patch.");
}

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
