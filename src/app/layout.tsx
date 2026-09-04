import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartCampusAI | AI-Powered Operating System for Education",
  description:
    "SmartCampusAI unifies CRM, ERP, LMS, BMS and AI into one intelligent platform for educational institutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
