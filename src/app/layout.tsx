import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RestaurantOS - Complete Restaurant Management System",
  description: "Comprehensive inventory, sales, and financial management for restaurants. Track menu items, analyze sales performance, manage ingredients, and generate reports.",
  keywords: ["restaurant", "inventory", "management", "POS", "sales", "analytics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <QueryProvider>
          <main className="flex-1">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
