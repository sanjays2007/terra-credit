import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/components/main-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriSuiteAI",
  description:
    "An AI-Driven Integrated Agri-Ecosystem Management Platform for Sustainable Food, Water, and Resource Optimization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <MainLayout>{children}</MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
