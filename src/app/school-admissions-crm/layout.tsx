export const revalidate = 0;
export const dynamic = 'force-dynamic';
import type { Metadata } from "next";

const siteUrl = "https://smartcampus.ai";

export const metadata: Metadata = {
  title: "School Admissions CRM | Admission Management Software",
  description:
    "SmartCampusAI School Admissions CRM helps schools manage parent enquiries, prospective students, follow-ups, counselling, applications, and admissions in one intelligent platform.",

  keywords: [
    "school admissions CRM",
    "school admission management software",
    "school admission software",
    "school enquiry management system",
    "student admission CRM",
    "school admissions management system",
    "school ERP admissions",
    "admission lead management for schools",
    "parent enquiry management",
    "school CRM software",
    "SmartCampusAI",
  ],

  alternates: {
    canonical: "/school-admissions-crm",
  },

  openGraph: {
    type: "website",
    url: `${siteUrl}/school-admissions-crm`,
    siteName: "SmartCampusAI",
    title: "School Admissions CRM | SmartCampusAI",
    description:
      "Manage school enquiries, prospective students, counselling, follow-ups, applications, and admissions with SmartCampusAI.",
  },

  twitter: {
    card: "summary_large_image",
    title: "School Admissions CRM | SmartCampusAI",
    description:
      "School-focused admissions CRM for managing enquiries, follow-ups, applications, and admissions.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function SchoolAdmissionsCRMLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
