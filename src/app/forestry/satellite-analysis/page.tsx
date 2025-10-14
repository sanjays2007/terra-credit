
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { SatelliteAnalysisForm } from "./satellite-analysis-form";
  import { Bot } from "lucide-react";
  
  export default function SatelliteAnalysisPage() {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Bot className="text-primary" />
              AI Satellite Imagery Analysis
            </CardTitle>
            <CardDescription>
              Analyze simulated satellite data (NDVI) along with ground observations to assess forest health and identify potential issues remotely.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SatelliteAnalysisForm />
          </CardContent>
        </Card>
      </div>
    );
  }
  