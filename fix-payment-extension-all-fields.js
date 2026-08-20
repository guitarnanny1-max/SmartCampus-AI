const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const modelRegex = /model SmartPaymentExtensionHub \{[^}]+\}/;
const newModel = `model SmartPaymentExtensionHub {
  id                      String   @id @default(cuid())
  schoolId                String
  school                  School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  invoiceId               String?
  amountPaid              String?
  extensionPeriod         String?
  previousRenewal         String?
  paymentMethod           String?
  aiBillingFraudDetection String?
  extensionCode           String?
  gatewayName             String?
  amount                  Float?
  currency                String?
  paymentStatus           String?
  status                  String?
  notes                   String?
  createdAt               DateTime @default(now())
  updatedAt             DateTime @updatedAt
}`;

if (modelRegex.test(schema)) {
  schema = schema.replace(modelRegex, newModel);
} else {
  schema += "\n" + newModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Updated SmartPaymentExtensionHub model with invoiceId and all required fields.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
