const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const printRegex = /model PrintJob \{[^}]+\}/;
const newPrintModel = `model PrintJob {
  id            String   @id @default(cuid())
  schoolId      String
  school        School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName   String?
  fileName      String?
  documentName  String?
  documentTitle String?
  pages         Int?
  pagesCount    Int?
  copies        Int?
  colorMode     String?
  printerName   String?
  status        String?
  category      String?
  cost          Float?
  createdAt     DateTime @default(now())
}`;

if (printRegex.test(schema)) {
  schema = schema.replace(printRegex, newPrintModel);
} else {
  schema += "\n" + newPrintModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added studentName, documentTitle, and pagesCount fields to PrintJob model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
