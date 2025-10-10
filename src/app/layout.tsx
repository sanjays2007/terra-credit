import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/components/main-layout";
import { Inter, Space_Grotesk } from 'next/font/google'
import "./globals.css";


const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
})


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
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}>
        <MainLayout>{children}</MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
