import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Create a sample tenant school workspace
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: "delhi" },
    update: {},
    create: {
      name: "Delhi Public SmartCampus",
      subdomain: "delhi",
      plan: "ENTERPRISE",
      status: "ACTIVE",
      contactEmail: "admin@delhi.smartcampusai.in",
      setupFeePaid: true,
      mrr: 45000,
    },
  });

  console.log(`Tenant created/verified: ${tenant.name} (${tenant.subdomain})`);

  // 2. Create users for different roles under this tenant
  const users = [
    { email: "admin@delhi.smartcampusai.in", name: "Principal Admin", role: "ADMIN", password: "password123" },
    { email: "teacher@delhi.smartcampusai.in", name: "Dr. Sharma (Math)", role: "TEACHER", password: "password123" },
    { email: "parent@delhi.smartcampusai.in", name: "Mr. & Mrs. Gupta", role: "PARENT", password: "password123" },
    { email: "student@delhi.smartcampusai.in", name: "Rahul Gupta", role: "STUDENT", password: "password123" },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        tenantId: tenant.id,
        email: u.email,
        name: u.name,
        role: u.role,
        password: u.password,
      },
    });
    console.log(`Created user: ${u.email} [Role: ${u.role}]`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
