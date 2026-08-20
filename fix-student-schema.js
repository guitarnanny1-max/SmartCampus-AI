const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const studentModelRegex = /model Student \{[^}]+\}/;
const newStudentModel = `model Student {
  id       String  @id @default(cuid())
  schoolId String
  school   School  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name     String
  grade    String?
  rollNo   String?
  cgpa     Float?
}`;

if (studentModelRegex.test(schema)) {
  schema = schema.replace(studentModelRegex, newStudentModel);
} else {
  schema += "\n" + newStudentModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Updated Student model in prisma/schema.prisma with rollNo and cgpa.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
