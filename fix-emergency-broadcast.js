const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// Add relation field to School model if not already present
if (!schema.includes("emergencyBroadcasts")) {
  schema = schema.replace(
    /model School \{([^}]+)\}/,
    `model School {$1
  emergencyBroadcasts EmergencyBroadcast[]
}`
  );
}

// Append EmergencyBroadcast model if not already present
if (!schema.includes("model EmergencyBroadcast")) {
  schema += `
model EmergencyBroadcast {
  id          String   @id @default(cuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title       String
  message     String?
  severity    String?
  targetGroup String?
  status      String?
  createdAt   DateTime @default(now())
}
`;
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added EmergencyBroadcast model and relation to prisma/schema.prisma");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
