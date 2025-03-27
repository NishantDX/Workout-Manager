"use client";

import { Geist, Geist_Mono } from "next/font/google";
import axios from "axios";
import { useEffect } from "react";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Only set axios defaults in the client
    if (typeof window !== "undefined") {
      axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
    }
  }, []);

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} flex h-screen`}
    >
      {children}
    </div>
  );
}
