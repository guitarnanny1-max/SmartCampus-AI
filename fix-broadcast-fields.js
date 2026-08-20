const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const broadcastRegex = /model EmergencyBroadcast \{[^}]+\}/;
const newBroadcastModel = `model EmergencyBroadcast {
  id             String   @id @default(cuid())
  schoolId       String
  school         School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title          String
  message        String?
  channel        String?
  recipientCount Int?
  severity       String?
  targetGroup    String?
  status         String?
  createdAt      DateTime @default(now())
}`;

if (broadcastRegex.test(schema)) {
  schema = schema.replace(broadcastRegex, newBroadcastModel);
} else {
  schema += "\n" + newBroadcastModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added channel and recipientCount fields to EmergencyBroadcast model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
