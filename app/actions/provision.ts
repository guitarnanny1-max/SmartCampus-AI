'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function provisionTenant(formData: FormData) {
  const name = formData.get('name') as string;
  const subdomain = formData.get('subdomain') as string;
  const plan = formData.get('plan') as string;

  try {
    await prisma.school.create({
      data: {
        name,
        code: Math.random().toString(36).substring(7).toUpperCase(),
        subdomain,
        subscriptionStatus: "ACTIVE",
        subscriptionTier: plan,
      }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Provisioning failed' };
  }
}
