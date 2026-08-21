const fs = require('fs');
const schemaPath = 'prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Fix missing SmartBiometricAttendanceHub relation in Tenant
if (!schema.includes('smartBiometricAttendanceHubs') && schema.includes('model SmartBiometricAttendanceHub')) {
  schema = schema.replace(/(model\s+Tenant\s+\{[^}]*)/, "$1\n  smartBiometricAttendanceHubs SmartBiometricAttendanceHub[]");
  console.log("✅ Added missing relation to Tenant model.");
}

// 2. Ensure EsgMetric exists
if (!schema.includes('model EsgMetric')) {
  schema += `
model EsgMetric {
  id          String   @id @default(cuid())
  tenantId    String?
  tenant      Tenant?  @relation(fields: [tenantId], references: [id])
  category    String   @default("CARBON")
  value       Float    @default(0.0)
  unit        String   @default("kgCO2e")
  recordedAt  DateTime @default(now())
  createdAt   DateTime @default(now())
}
`;
  console.log("✅ Added EsgMetric model.");
}

fs.writeFileSync(schemaPath, schema);
