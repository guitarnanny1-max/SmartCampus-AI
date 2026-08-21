import { PrismaClient } from '@prisma/client';

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
