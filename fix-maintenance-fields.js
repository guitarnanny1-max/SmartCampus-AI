const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// Add relation to School if missing
if (!schema.includes("maintenanceWorkOrders")) {
  schema = schema.replace(
    /model School \{([^}]+)\}/,
    `model School {$1
  maintenanceWorkOrders MaintenanceWorkOrder[]
}`
  );
}

const maintRegex = /model MaintenanceWorkOrder \{[^}]+\}/;
const newMaintModel = `model MaintenanceWorkOrder {
  id                 String   @id @default(cuid())
  schoolId           String
  school             School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  title              String?
  description        String?
  priority           String?
  status             String?
  category           String?
  building           String?
  location           String?
  assignedTo         String?
  assignedTechnician String?
  createdAt          DateTime @default(now())
}`;

if (maintRegex.test(schema)) {
  schema = schema.replace(maintRegex, newMaintModel);
} else {
  schema += "\n" + newMaintModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Updated MaintenanceWorkOrder model with building and assignedTechnician fields.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
