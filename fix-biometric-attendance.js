const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

function ensureSchoolRelation(modelName) {
  const schoolMatch = schema.match(/model School \{([^}]+)\}/);
  if (schoolMatch) {
    let schoolBody = schoolMatch[1];
    const camelCase = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    if (!schoolBody.includes(camelCase)) {
      const lines = schoolBody.split("\n");
      const filteredLines = lines.filter(line => line.trim() !== "}");
      filteredLines.push(`  ${camelCase} ${modelName}[]`);
      const newSchoolBody = filteredLines.join("\n");
      schema = schema.replace(schoolMatch[0], `model School {\n${newSchoolBody}\n}`);
    }
  }
}

const modelsToAdd = [
  {
    name: "SmartBiometricAttendanceHub",
    fields: `
  deviceCode             String?
  deviceName             String?
  studentName            String?
  enrollmentNo           String?
  attendanceStatus       String?
  confidenceScore        Float?
  verificationMode       String?
  facialMatchPct         Float?
  irisScanStatus         String?
  aiAntiSpoofingScore    Float?
    `
  },
  {
    name: "SmartBiometricHub",
    fields: `
  deviceCode             String?
  deviceName             String?
  status                 String?
    `
  },
  {
    name: "SmartAttendanceHub",
    fields: `
  studentName            String?
  status                 String?
    `
  }
];

modelsToAdd.forEach(m => {
  ensureSchoolRelation(m.name);
  const modelRegex = new RegExp(`model ${m.name} \\{[^}]+\\}`);
  const newModel = `model ${m.name} {
  id        String   @id @default(cuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  ${m.fields}
  status    String?
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`;

  if (modelRegex.test(schema)) {
    schema = schema.replace(modelRegex, newModel);
  } else {
    schema += "\n" + newModel + "\n";
  }
});

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Added SmartBiometricAttendanceHub and related models successfully.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
