import subprocess
import os
import shutil
import re

SCHEMA_PATH = "prisma/schema.prisma"
if not os.path.exists(SCHEMA_PATH):
    for root, dirs, files in os.walk("."):
        if "schema.prisma" in files and "node_modules" not in root:
            SCHEMA_PATH = os.path.join(root, "schema.prisma")
            break

print(f"🎯 Target Prisma Schema Path: {SCHEMA_PATH}")

with open(SCHEMA_PATH, "r") as f:
    schema = f.read()

# Completely remove existing ApiKey definition if any
schema = re.sub(r'model ApiKey\s*\{[^}]*\}', '', schema)

# Define model with schoolId, tenantId, and proper relations
model_def = """
model ApiKey {
  id        String   @id @default(uuid())
  tenantId  String?
  tenant    Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  schoolId  String?
  school    School?  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  name      String?  @default("API Key")
  key       String?  @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
"""

schema = schema.strip() + "\n\n" + model_def.strip() + "\n"

# Helper function to add relations to existing models safely
def add_relation_to_model(schema_str, model_name, relation_line):
    pattern = rf'(model\s+{model_name}\s*\{{[^}}]*?\}})'
    match = re.search(pattern, schema_str, re.DOTALL)
    if match:
        model_block = match.group(1)
        field_name = relation_line.strip().split()[0]
        if field_name not in model_block:
            updated_block = model_block.rstrip('}').rstrip() + f"\n  {relation_line}\n}}\n"
            schema_str = schema_str.replace(model_block, updated_block, 1)
    return schema_str

schema = add_relation_to_model(schema, "School", "apiKeys ApiKey[]")
schema = add_relation_to_model(schema, "Tenant", "apiKeys ApiKey[]")

with open(SCHEMA_PATH, "w") as f:
    f.write(schema)

print("✨ Schema updated successfully!")

# Purge caches
for path in [".next", "node_modules/.prisma", "tsconfig.tsbuildinfo"]:
    if os.path.exists(path):
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.remove(path)

print("⚙️ Running npx prisma generate...")
subprocess.run(["npx", "prisma", "generate", "--schema=" + SCHEMA_PATH], check=True)

print("🚀 Running npm run build...")
subprocess.run(["npm", "run", "build"], check=True)
print("🎉 Build passed successfully!")
