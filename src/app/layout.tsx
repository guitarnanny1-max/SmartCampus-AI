import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/website/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://smartcampus.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "SmartCampusAI | AI-Powered School Management Software",
    template: "%s | SmartCampusAI",
  },

  description:
    "SmartCampusAI is AI-powered school management software for student management, admissions CRM, attendance, fees, academics, communication, analytics, and intelligent school operations.",

  keywords: [
    "school management software",
    "school management system",
    "AI school management software",
    "school ERP",
    "school ERP software",
    "student management system",
    "school admission software",
    "school admissions CRM",
    "school attendance management",
    "school fee management software",
    "school analytics",
    "school administration software",
    "education management platform",
    "school automation software",
    "AI for schools",
    "SmartCampusAI",
  ],

  authors: [
    {
      name: "ThomasG Technologies",
    },
  ],

  creator: "ThomasG Technologies",
  publisher: "ThomasG Technologies",

  applicationName: "SmartCampusAI",

  category: "Education",

  classification: "School Management Software",

  referrer: "origin-when-cross-origin",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "SmartCampusAI",
    title:
      "SmartCampusAI | AI-Powered School Management Software",
    description:
      "Manage students, teachers, admissions, attendance, fees, academics, CRM, communication, analytics, and school operations with one intelligent platform.",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "SmartCampusAI | AI-Powered School Management Software",
    description:
      "AI-powered school management software for modern schools and education teams.",
  },

  other: {
    "application-name": "SmartCampusAI",
    "apple-mobile-web-app-title": "SmartCampusAI",
    "theme-color": "#4f46e5",
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

  verification: {
    // Add your Google Search Console verification value here
    // once Google provides it.
    google: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
