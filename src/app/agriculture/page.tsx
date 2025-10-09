import { FileText, Lightbulb, Wheat, Sprout } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SummarizeAdvisoryForm from "./summarize-advisory-form";
import { StatCard } from "@/components/stat-card";

export default function AgriculturePage() {
  return (
    <div className="p-4 md:p-6 grid gap-6 grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Lightbulb className="text-primary" />
              AI-Powered Advisory Summarizer
            </CardTitle>
            <CardDescription>
              Upload a PDF from your local extension office to get a summary of
              actionable recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SummarizeAdvisoryForm />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">
              Crop Planning
            </CardTitle>
            <CardDescription>
              AI recommendations for your next crop cycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="font-semibold">Next Crop: Maize</p>
                <p className="text-sm text-muted-foreground">
                  Optimal sowing window: Jul 25 - Aug 10
                </p>
              </div>
              <Wheat className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="font-semibold">Rotation: Mung Beans</p>
                <p className="text-sm text-muted-foreground">
                  Improves nitrogen levels by 15%
                </p>
              </div>
              <Sprout className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
