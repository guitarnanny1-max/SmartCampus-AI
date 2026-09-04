"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // School application has its own workspace navigation.
  if (pathname.startsWith("/app")) {
    return null;
  }

  return <Navbar />;
}
