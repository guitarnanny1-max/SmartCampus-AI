const fs = require("fs");
const { execSync } = require("child_process");

const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");

// Remove duplicate status lines in SmartBiometricHub and SmartAttendanceHub
schema = schema.replace(/model SmartBiometricHub \{([^}]+)\}/g, (match, body) => {
  let lines = body.split("\n").filter(l => l.trim() !== "");
  let seenStatus = false;
  lines = lines.filter(l => {
    if (l.trim().startsWith("status")) {
      if (seenStatus) return false;
      seenStatus = true;
    }
    return true;
  });
  return `model SmartBiometricHub {\n${lines.join("\n")}\n}`;
});

schema = schema.replace(/model SmartAttendanceHub \{([^}]+)\}/g, (match, body) => {
  let lines = body.split("\n").filter(l => l.trim() !== "");
  let seenStatus = false;
  lines = lines.filter(l => {
    if (l.trim().startsWith("status")) {
      if (seenStatus) return false;
      seenStatus = true;
    }
    return true;
  });
  return `model SmartAttendanceHub {\n${lines.join("\n")}\n}`;
});

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

ensureSchoolRelation("SmartBiometricAttendanceHub");

const biometricModelRegex = /model SmartBiometricAttendanceHub \{[^}]+\}/;
const newBiometricModel = `model SmartBiometricAttendanceHub {
  id                  String   @id @default(cuid())
  schoolId            String
  school              School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  deviceCode          String?
  deviceName          String?
  studentName         String?
  enrollmentNo        String?
  attendanceStatus    String?
  confidenceScore     Float?
  verificationMode    String?
  facialMatchPct      Float?
  irisScanStatus      String?
  aiAntiSpoofingScore Float?
  status              String?
  notes               String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}`;

if (biometricModelRegex.test(schema)) {
  schema = schema.replace(biometricModelRegex, newBiometricModel);
} else {
  schema += "\n" + newBiometricModel + "\n";
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ Fixed schema duplicates and updated SmartBiometricAttendanceHub.");

console.log("🔄 Pushing database schema update...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

console.log("⚡ Generating Prisma Client types...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("🏗️ Running production build verification...");
execSync("npm run build", { stdio: "inherit" });
console.log("🎉 Build completed successfully!");
