const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const counselingRegex = /model CounselingSession \{[^}]+\}/;
const newCounselingModel = `model CounselingSession {
  id            String   @id @default(cuid())
  schoolId      String
  school        School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName   String?
  counselorName String?
  issueCategory String?
  sessionDate   String?
  topic         String?
  status        String?
  date          String?
  createdAt     DateTime @default(now())
}`;

if (counselingRegex.test(schema)) {
  schema = schema.replace(counselingRegex, newCounselingModel);
} else {
  schema += "\n" + newCounselingModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added issueCategory and sessionDate fields to CounselingSession model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
