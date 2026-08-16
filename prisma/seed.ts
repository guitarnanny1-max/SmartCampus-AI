import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({});
  await prisma.alert.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.facility.deleteMany({});
  await prisma.school.deleteMany({});

  const dps = await prisma.school.create({
    data: {
      name: 'Delhi Public School',
      subdomain: 'dps',
      logoUrl: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=100&h=100&fit=crop',
      facilities: {
        create: [
          { zoneName: 'Academic Block A', solar: '45 kW', hvac: 'Optimized (22°C)', status: 'Optimal' },
          { zoneName: 'Sports Complex', solar: '30 kW', hvac: 'Standby', status: 'Active' },
        ],
      },
      students: {
        create: [
          { name: 'Aarav Sharma', rollNo: 'DPS-2026-01', cgpa: 9.4 },
          { name: 'Ananya Patel', rollNo: 'DPS-2026-02', cgpa: 8.9 },
        ],
      },
      placements: {
        create: [
          { company: 'Google', role: 'Software Engineering Intern', ctc: '₹45 LPA', offers: '2 Offers' },
        ],
      },
      alerts: {
        create: [
          { title: 'Solar Grid Peak', severity: 'INFO', message: 'Academic Block A solar output reached daily maximum capacity (45 kW).' },
          { title: 'HVAC Maintenance Due', severity: 'WARNING', message: 'Sports Complex air handling unit filter check recommended.' },
        ],
      },
      users: {
        create: [
          { name: 'Principal Sharma', email: 'admin@dps.edu', role: 'TENANT_ADMIN' },
        ],
      },
    },
  });

  const greenwood = await prisma.school.create({
    data: {
      name: 'Greenwood High International',
      subdomain: 'greenwood',
      logoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100&h=100&fit=crop',
      facilities: {
        create: [
          { zoneName: 'Science Wing', solar: '60 kW', hvac: 'Smart Auto (21°C)', status: 'Optimal' },
        ],
      },
      students: {
        create: [
          { name: 'Liam Johnson', rollNo: 'GWI-2026-01', cgpa: 9.6 },
        ],
      },
      placements: {
        create: [
          { company: 'Apple', role: 'AI Researcher', ctc: '$120,000', offers: '1 Offer' },
        ],
      },
      alerts: {
        create: [
          { title: 'Eco Mode Engaged', severity: 'INFO', message: 'Science Wing successfully shifted to automated low-power cooling schedule.' },
        ],
      },
      users: {
        create: [
          { name: 'Director Vance', email: 'admin@greenwood.edu', role: 'TENANT_ADMIN' },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      name: 'Global Super Admin',
      email: 'root@smartcampus.ai',
      role: 'PLATFORM_ADMIN',
    },
  });

  console.log('Successfully seeded database with alerts and tenant records!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
