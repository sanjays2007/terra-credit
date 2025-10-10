
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import AppNav from "@/components/app-nav";
import AppHeader from "@/components/app-header";
import { ArrowLeft } from "lucide-react";

const pageTitles: { [key: string]: string } = {
  "/": "Dashboard",
  "/agriculture": "Agriculture & Horticulture",
  "/livestock": "Livestock Management",
  "/aquaculture": "Aquaculture & Fisheries",
  "/forestry": "Forestry & Agroforestry",
  "/aquaculture/analysis": "AI Water Quality Analysis",
  "/credit-scoring": "AI Credit Scoring",
  "/agriculture/crop-planning": "AI Crop Planning",
  "/forestry/analysis": "AI Forestry Analysis",
  "/agriculture/pest-detection": "AI Pest & Disease Detection",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || "AgriSuiteAI";
  const isSubPage = !["/", "/agriculture", "/livestock", "/aquaculture", "/forestry", "/credit-scoring"].includes(pathname);
  const isFeaturePage = ["/agriculture", "/livestock", "/aquaculture", "/forestry", "/credit-scoring"].includes(pathname);


  return (
    <SidebarProvider>
      <Sidebar>
        <AppNav />
      </Sidebar>
      <SidebarRail />
      <SidebarInset>
        <div className="relative">
          {(isSubPage || isFeaturePage) && (
             <Button
             variant="outline"
             size="sm"
             className="absolute left-4 top-3.5 hidden md:flex"
             asChild
           >
             <Link href="/">
               <ArrowLeft className="mr-2 h-4 w-4" />
               Back
             </Link>
           </Button>
          )}
          <AppHeader title={pageTitle} showBackButton={isSubPage || isFeaturePage} />
        </div>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
