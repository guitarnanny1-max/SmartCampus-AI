const fs = require('fs');
const schemaPath = 'prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

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
}

if (!schema.includes('esgMetrics') && schema.includes('model Tenant')) {
  schema = schema.replace(/(model\s+Tenant\s+\{[^}]*)/, "$1\n  esgMetrics EsgMetric[]");
}

fs.writeFileSync(schemaPath, schema);
console.log("✅ EsgMetric model verified in schema.");
