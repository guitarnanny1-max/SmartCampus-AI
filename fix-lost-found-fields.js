const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const lostRegex = /model LostItem \{[^}]+\}/;
const newLostModel = `model LostItem {
  id            String   @id @default(cuid())
  schoolId      String
  school        School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  itemName      String?
  locationFound String?
  founderName   String?
  description   String?
  location      String?
  status        String?
  category      String?
  dateLost      String?
  reportedBy    String?
  createdAt     DateTime @default(now())
}`;

if (lostRegex.test(schema)) {
  schema = schema.replace(lostRegex, newLostModel);
} else {
  schema += "\n" + newLostModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added locationFound and founderName fields to LostItem model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
