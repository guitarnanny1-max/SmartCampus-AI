import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function getCurrentSchool() {
  try {
    const headersList = await headers();
    const headerSubdomain = headersList.get('x-school-subdomain');
    let subdomain = headerSubdomain || 'dps';  

    let school = await prisma.school.findUnique({
      where: { subdomain },
    });

    if (!school) {
      // Fallback or auto-create default school if not found
      school = await prisma.school.upsert({
        where: { subdomain: 'dps' },
        update: {},
        create: {
          name: 'Delhi Public School',
          subdomain: 'dps',
          email: 'admin@dps.edu',
        },
      });
    }

    return school;
  } catch (error) {
    console.warn('Database table not ready yet, returning fallback mock school object.');
    // Fallback mock object so pages render instead of throwing 500 unhandled errors
    return {
      id: 'mock-school-id',
      name: 'SmartCampus Default Institution',
      subdomain: 'dps',
      email: 'admin@smartcampus.ai',
    };
  }
}
