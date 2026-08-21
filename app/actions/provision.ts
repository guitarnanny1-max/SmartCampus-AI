import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";



export async function provisionTenant(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const subdomain = formData.get("subdomain") as string;
  const plan = (formData.get("plan") as string) || "school-growth";
  const contactEmail = formData.get("contactEmail") as string;

  if (!name || !subdomain) {
    return { success: false, error: "Name and subdomain are required." };
  }

  try {
    const tenant = await prisma.tenant.create({
      data: {
        name,
        subdomain: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, ""),
        plan,
        contactEmail: contactEmail || "admin@" + subdomain + ".com",
        status: "ACTIVE",
        mrr: plan === "digital-starter" ? 999 : plan === "school-growth" ? 2999 : 5999,
        setupFeePaid: true
      }
    });

    revalidatePath("/admin/tenants");
    return { success: true, tenant };
  } catch (error: any) {
    console.error("Provisioning Error:", error);
    return { success: false, error: error.message || "Failed to provision workspace." };
  }
}
