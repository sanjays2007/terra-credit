
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WaterQualityAnalysisForm } from "./water-quality-analysis-form";
import { Bot } from "lucide-react";

export default function WaterQualityAnalysisPage() {
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Bot className="text-primary" />
            AI Water Quality Analysis
          </CardTitle>
          <CardDescription>
            Enter your pond's current water quality parameters to receive
            AI-powered analysis and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WaterQualityAnalysisForm />
        </CardContent>
      </Card>
    </div>
  );
}
