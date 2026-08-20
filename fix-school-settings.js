const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const schoolRegex = /model School \{([^}]+)\}/;
const match = schema.match(schoolRegex);

if (match) {
  let schoolBody = match[1];
  const fieldsToAdd = [
    "whiteLabelBrandName",
    "whiteLabelLogoUrl",
    "customDomain",
    "primaryColor",
    "accentColor",
    "timezone",
    "currency",
    "subscriptionTier",
    "subscriptionStatus"
  ];

  fieldsToAdd.forEach(field => {
    if (!schoolBody.includes(field)) {
      schoolBody += `  ${field.padEnd(22)} String?\n`;
    }
  });

  schema = schema.replace(schoolRegex, `model School {${schoolBody}}`);
  fs.writeFileSync(schemaPath, schema, "utf8");
  console.log("✅ Added missing school setting fields to School model.");
}

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
