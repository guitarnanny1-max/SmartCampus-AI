const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const eventRegex = /model EventClub \{[^}]+\}/;
const newEventModel = `model EventClub {
  id          String   @id @default(cuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title       String?
  eventName   String?
  clubName    String?
  venue       String?
  eventDate   String?
  location    String?
  category    String?
  budget      Float?
  status      String?
  description String?
  createdAt   DateTime @default(now())
}`;

if (eventRegex.test(schema)) {
  schema = schema.replace(eventRegex, newEventModel);
} else {
  schema += "\n" + newEventModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added venue and budget fields to EventClub model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
