const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.invoice.deleteMany().catch(() => {});
  await prisma.maintenanceTicket.deleteMany().catch(() => {});
  await prisma.facility.deleteMany().catch(() => {});
  await prisma.student.deleteMany().catch(() => {});
  await prisma.staff.deleteMany().catch(() => {});
  await prisma.school.deleteMany().catch(() => {});

  await prisma.school.create({
    data: {
      name: "Global Tech Academy",
      code: "GTA01",
      subdomain: "demo",
      subscriptionStatus: "ACTIVE",
      subscriptionTier: "ENTERPRISE",
      primaryColor: "#0f172a",
      applicants: {
        create: [
          { applicantId: "APP-101", name: "Samantha Miller", email: "samantha@app.edu", gradeApplied: "10th", status: "Reviewing" },
          { applicantId: "APP-102", name: "Liam Parker", email: "liam@app.edu", gradeApplied: "11th", status: "Accepted" },
          { applicantId: "APP-103", name: "Zoya Khan", email: "zoya@app.edu", gradeApplied: "12th", status: "Enrolled" }
        ]
      },
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
