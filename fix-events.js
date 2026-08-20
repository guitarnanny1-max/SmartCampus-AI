const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// Add relation field to School model if not already present
if (!schema.includes("eventClubs")) {
  schema = schema.replace(
    /model School \{([^}]+)\}/,
    `model School {$1
  eventClubs EventClub[]
}`
  );
}

// Append EventClub model if not already present
if (!schema.includes("model EventClub")) {
  schema += `
model EventClub {
  id          String   @id @default(cuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title       String?
  eventName   String?
  clubName    String?
  eventDate   String?
  location    String?
  category    String?
  status      String?
  description String?
  createdAt   DateTime @default(now())
}
`;
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added EventClub model and relation to prisma/schema.prisma");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
