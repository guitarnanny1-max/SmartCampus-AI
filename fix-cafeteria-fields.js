const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

const cafeteriaOrderRegex = /model CafeteriaOrder \{[^}]+\}/;
const newCafeteriaOrderModel = `model CafeteriaOrder {
  id          String   @id @default(cuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  studentName String?
  mealType    String?
  itemTitle   String?
  dietaryTag  String?
  itemNames   String?
  totalAmount Float?
  amount      Float?
  status      String?
  createdAt   DateTime @default(now())
}`;

if (cafeteriaOrderRegex.test(schema)) {
  schema = schema.replace(cafeteriaOrderRegex, newCafeteriaOrderModel);
} else {
  schema += "\n" + newCafeteriaOrderModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added studentName, mealType, itemTitle, and dietaryTag fields to CafeteriaOrder model.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
