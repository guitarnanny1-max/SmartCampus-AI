import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartCampus AI",
  description: "The 360 Degrees Campus OS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
