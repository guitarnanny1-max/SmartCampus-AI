const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const alumniModels = `
model AlumniEndowment {
  id        String   @id @default(cuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  donorName String
  amount    Float
  purpose   String?
  createdAt DateTime @default(now())
}

model AlumniNetwork {
  id        String   @id @default(cuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name      String
  batch     String?
  profession String?
  createdAt DateTime @default(now())
}
`;

// Append alumni models if not already present
if (!schema.includes("model AlumniEndowment")) {
  schema += alumniModels;
  fs.writeFileSync(schemaPath, schema, "utf8");
  console.log("✅ Added AlumniEndowment and AlumniNetwork models to prisma/schema.prisma");
}

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
