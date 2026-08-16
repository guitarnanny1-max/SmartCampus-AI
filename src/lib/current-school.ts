import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function getCurrentSchool() {
  const headerList = headers();
  const headerSubdomain = headerList.get('x-school-subdomain');

  // Fallback search or default handling if needed can be read from URL searchParams if passed in server components
  let subdomain = headerSubdomain || 'dps';

  let school = await prisma.school.findUnique({
    where: { subdomain },
  });

  if (!school) {
    // Fallback to default first school if subdomain doesn't match
    school = await prisma.school.findFirst();
  }

  if (!school) {
    throw new Error('No school tenants found in the database. Please run the seed script.');
  }

  return school;
}
