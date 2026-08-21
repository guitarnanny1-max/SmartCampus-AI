import os
import subprocess

print("⚙️ Updating scripts/verify-launch.ts with correct Lead properties...")

script_path = "scripts/verify-launch.ts"
os.makedirs(os.path.dirname(script_path), exist_ok=True)

content = """import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Verifying launch data...");
  
  let lead = await prisma.lead.findFirst();
  if (!lead) {
    lead = await prisma.lead.create({
      data: {
        school: "Apex International School",
        name: "Dr. Aris Thorne",
        email: "admin@apex.edu",
        phone: "+1-555-0199",
        studentStrength: 1200,
        location: "New York, USA",
        temperature: "🔥 Hot",
        status: "NEW"
      }
    });
    console.log("✅ Created test lead:", lead);
  } else {
    console.log("✅ Lead verified:", lead);
  }

  const tenantCount = await prisma.tenant.count();
  console.log(`📊 Total Tenants: ${tenantCount}`);
  console.log("🎉 Launch verification completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
"""

with open(script_path, "w", encoding="utf-8") as f:
    f.write(content)

print("✨ Updated scripts/verify-launch.ts successfully!")

build_env = os.environ.copy()
build_env["DATABASE_URL"] = "file:./dev.db"

try:
    print("1️⃣ Generating Prisma Client...")
    subprocess.run(["npx", "prisma", "generate"], check=True, env=build_env)
    
    print("2️⃣ Running Next.js Production Build...")
    subprocess.run(["npm", "run", "build"], check=True, env=build_env)
    
    print("\n🎉 SUCCESS! The entire project compiled successfully with zero errors!")
except subprocess.CalledProcessError as e:
    print(f"\n❌ Build failed with exit code {e.returncode}")
    exit(1)
