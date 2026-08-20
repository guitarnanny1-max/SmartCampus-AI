const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const paymentRegex = /model CampusPaymentRecord \{[^}]+\}/;
const newPaymentModel = `model CampusPaymentRecord {
  id            String   @id @default(cuid())
  schoolId      String
  school        School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  orderId       String?
  paymentId     String?
  amount        Float?
  amountInr     Float?
  currency      String?
  status        String?
  paymentMethod String?
  description   String?
  receiptNumber String?
  studentName   String?
  purpose       String?
  createdAt     DateTime @default(now())
}`;

if (paymentRegex.test(schema)) {
  schema = schema.replace(paymentRegex, newPaymentModel);
} else {
  schema += "\n" + newPaymentModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added description field to CampusPaymentRecord model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
