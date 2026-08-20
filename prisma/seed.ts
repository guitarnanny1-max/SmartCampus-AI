import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.invoice.deleteMany();
  await prisma.maintenanceTicket.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.student.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.school.deleteMany();

  await prisma.school.create({
    data: {
      name: "Global Tech Academy",
      code: "GTA01",
      subdomain: "demo",
      subscriptionStatus: "ACTIVE",
      subscriptionTier: "ENTERPRISE",
      primaryColor: "#0f172a",
      students: {
        create: [
          { studentId: "STU-001", name: "Alice Johnson", grade: "10th", email: "alice@gta.edu", gpa: 3.8 },
          { studentId: "STU-002", name: "Bob Smith", grade: "11th", email: "bob@gta.edu", gpa: 3.5 }
        ]
      }
    }
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
